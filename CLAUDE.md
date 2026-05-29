# CLAUDE.md

Instrucciones persistentes para Claude Code al trabajar en este repositorio.

## Stack y comandos críticos

Nx 22 · Angular 21 · Module Federation · TypeScript ≥5.8 · RxJS 7.8. Node 22 LTS, fijado por `.nvmrc`.

```bash
# Desarrollo: SIEMPRE arrancar por el shell con el proxy (resuelve CORS contra el Gateway)
npx nx serve shell --proxy-config apps/shell/proxy.conf.json

# Puertos por convención: shell=4200, profile=4201, roles=4202, users=4203
# Build de producción (cada app por separado)
npx nx build <project> --configuration=production
```

Tras añadir un MFE remoto o tocar `module-federation.config.ts`, el hot reload no basta: reiniciar `nx serve` por completo.

## Arquitectura

Monorepo Nx con layout clásico `apps/` + `libs/`. El **shell** es el host y los demás son remotos cargados perezosamente vía Module Federation.

| App       | Puerto | Rol                                                                    |
|-----------|--------|------------------------------------------------------------------------|
| `shell`   | 4200   | **Host**: login, sesión JWT, interceptor global, navbar, guards, manifest de federación |
| `profile` | 4201   | Remoto: perfil del usuario autenticado                                |
| `roles`   | 4202   | Remoto: CRUD de roles (solo `superadmin`)                              |
| `users`   | 4203   | Remoto: CRUD de usuarios (solo `superadmin`)                           |

Regla innegociable: **el navegador nunca habla directo con un microservicio**. Todo va al API Gateway, que valida el JWT y enruta.

## Federación dinámica (importante)

Este proyecto usa **federación dinámica con manifest**, no estática.

- El array `remotes` en `apps/shell/module-federation.config.ts` está **vacío** a propósito (`remotes: []`).
- Las URLs de los remotos viven en `apps/shell/public/module-federation.manifest.json`, que Nginx/Render sirve como archivo estático.
- `apps/shell/src/main.ts` hace `fetch('/module-federation.manifest.json')` y registra los remotos con `setRemoteDefinitions` (de `@nx/angular/mf`) **antes** del bootstrap.
- Esto permite cambiar URLs sin reconstruir el Shell ("build once, deploy anywhere"). No volver a federación estática salvo decisión arquitectónica explícita.

`setRemoteDefinitions` aparece marcada como deprecated en el editor pero funciona correctamente en esta versión; no migrar sin una razón concreta.

## Clean Architecture

Cada feature (en shell o en un remoto) se separa en tres capas. Sin mezclas.

**Domain** (`domain/`) — cero dependencias de Angular core. Solo `rxjs` permitido. Modelos como interfaces, repositorios como clases abstractas, casos de uso como clases que reciben el repositorio por constructor.

**Data** (`data/`) — única capa que conoce el Gateway y `HttpClient`. DTOs que reflejan **la forma cruda del API**, mappers DTO→dominio, implementaciones concretas de repositorios.

**Presentation** (`presentation/`) — componentes y estado. Smart (páginas, conectados al store) vs Dumb (`input()`/`output()`, sin acceso a store). Standalone, `ChangeDetectionStrategy.OnPush`, control de flujo `@if`/`@for`.

**Wiring por feature**: cada feature expone `<feature>.providers.ts` con una función `provide<Feature>()` que ata la interfaz abstracta del dominio a su implementación concreta y registra los casos de uso. Esos providers se aplican **a nivel de ruta**, no global.

### Regla del Store en remotos

El Store de un remoto NO va con `providedIn: 'root'`. Va como `@Injectable()` simple y se incluye en los `providers` de la ruta del remoto, junto a `provide<Feature>()`. Si está como `providedIn: 'root'`, Angular intenta crearlo en la raíz pero los casos de uso viven en el alcance de la ruta → `NG0201: No provider found`.

```typescript
// entry.routes.ts del remoto
export const remoteRoutes: Route[] = [
  { path: '', component: <Page>, providers: [...provide<Feature>(), <Feature>Store] },
];
```

## API contract — particularidades reales

Verificar siempre la respuesta real con Postman/Swagger antes de codificar un DTO. La API tiene convenciones propias:

**Convención**: `camelCase` en todas partes (`accessToken`, `createdAt`). NO `snake_case`.

**Login** (`POST /auth/login`):
```json
{
  "user": { "id": "uuid", "username": "haroldcorp", "role": "superadmin" },
  "accessToken": "...", "refreshToken": "..."
}
```
El usuario trae un único `role` como **string** (no array). No hay `fullName`, `email`, `permissions` ni `expiresAt`/`expiresIn`. La expiración está dentro del JWT (`exp`).

**Listados paginados** (`GET /roles`, `GET /users`, etc.):
```json
{ "data": [...], "total": N, "page": 1, "size": 10 }
```
El mapper debe hacer `res.data.map(toModel)`. Los items traen campos de auditoría (`createdAt`, `updateAt` —sin "d"—, `deletedAt`, `createdBy`, etc.) que normalmente NO se mapean al dominio.

**Relación usuario-rol** (asimétrica):
- En **lectura** (`GET /users`), el rol viene **anidado como objeto**: `role: { id, name, ... }`.
- En **escritura** (`POST`/`PATCH /users`), se envía como **`roleId` plano** (string).
- El mapper debe extraer `role.name` (para mostrar) y `role.id` (para preseleccionar en el formulario de edición).

**Contraseña en `PATCH /users/{id}`**: opcional. Si el formulario la deja vacía, **eliminarla del body** antes de enviar; nunca enviar string vacío (sobrescribiría con vacío).

## Auth, proxy y entornos

- JWT en `sessionStorage` (sobrevive a recarga, se borra al cerrar pestaña). Decisión por menor superficie XSS frente a `localStorage`.
- `AuthInterceptor` global registrado en el shell inyecta `Authorization: Bearer <token>` en TODA petición saliente. Los remotos no manejan token.
- Guards en el shell: `authGuard` (requiere sesión), `guestGuard` (impide ver login si hay sesión), `roleGuard(roles[])`.
- **Proxy `/api`**: vive en `apps/shell/proxy.conf.json` y SOLO actúa en desarrollo con `nx serve`. En producción no existe. El `environment.ts` usa `apiGatewayUrl: '/api'`; el `environment.prod.ts` debe apuntar a la URL real del Gateway con HTTPS.
- **HTTPS obligatorio en producción**: el frontend se sirve por HTTPS (Render/CDN). Si el Gateway es HTTP, el navegador bloquea por *mixed content* y no hay forma de evitarlo desde el frontend. Si aparece ese error, la solución es del backend (habilitar HTTPS), no nuestra.
- **CORS en producción**: lo configura el backend, aprobando el origen del shell. No intentar "arreglar CORS" desde Angular.

## Menú dinámico por rol

`apps/shell/src/app/core/layout/navbar/navbar.component.ts` tiene un catálogo `allItems` con `{ label, path, roles? }`. Un `computed` filtra según `AuthStore.roles()`. Para añadir un módulo al menú: nueva entrada en `allItems` con los roles permitidos, MÁS proteger la ruta con `authGuard` (y opcionalmente `roleGuard`) en el shell. Ocultar el menú no es suficiente; la ruta también debe bloquearse por URL directa.

## Estilo UI

**Paleta** (definida en `libs/shared/ui/src/lib/tokens/theme.css` como variables CSS):
- Primario `#4338ca`, tinta `#0f172a`, primario suave `#e0e7ff`, superficie `#f1f5f9`, acento `#c5e6a6`.

**Reglas firmes**:
- Sin animaciones. Ni transiciones decorativas ni keyframes.
- Foco visible (`outline` claro) y atributos `aria-*` en formularios.
- Smart components solo orquestan; toda la UI vive en Dumb components con `input()`/`output()`.
- Para tablas, mostrar `@empty` con mensaje cuando la lista está vacía.

## Despliegue (estado real)

Realismo importante: en este proyecto Docker funciona en local, pero el despliegue actual usa **static sites en Render** (no web services con Docker), porque el plan gratuito de web services tiene limitaciones (15 min de inactividad, un solo servicio).

Implicaciones de los static sites:
- Cada MFE se despliega como Static Site independiente; el Shell se despliega al final con el manifest apuntando a las URLs reales de los remotos.
- Render NO usa el Nginx propio del proyecto: el `proxy_pass` que existe en `apps/shell/nginx.conf` solo aplica al modo Docker, no a Render.
- En Render, el frontend llama **directo** al Gateway, lo que exige Gateway con HTTPS + CORS habilitado por el backend.
- Configurar en Render una **Rewrite Rule** `/* → /index.html` por cada Static Site (equivalente al `try_files` de Nginx). Sin esto, recargar `/login` o cualquier ruta interna da 404.

## Añadir un nuevo MFE

Ver `./GUIA-DESARROLLO.md` para la receta completa de 10 pasos. Resumen:

1. `npx nx g @nx/angular:remote apps/<name> --host=shell --style=css` (verificar que `nx show projects` lo lista después).
2. Estructura de carpetas Domain/Data/Presentation dentro de `apps/<name>/src/app/<feature>/`.
3. Codificar las tres capas en orden, ajustando DTOs a la respuesta real del API.
4. Wiring en `<feature>.providers.ts` y `entry.routes.ts` (con el Store en los providers de la ruta).
5. Conectar al shell: ruta protegida con `authGuard` en `app.routes.ts`, y añadir al menú con sus roles si aplica.
6. Reiniciar `nx serve shell --proxy-config ...` (no basta con hot reload).

## Cosas que NO hacer

- No importar `@angular/core` ni `@angular/common/http` en la capa Domain.
- No llamar a un microservicio directo; toda petición va al API Gateway.
- No poner el Store del remoto con `providedIn: 'root'` (NG0201).
- No usar `snake_case` en DTOs por costumbre; este API es `camelCase`.
- No proponer "arreglos" de mixed content o CORS desde el frontend; son del backend.
- No volver a federación estática salvo decisión explícita; el manifest dinámico es el patrón.
- No introducir versiones divergentes de Angular o RxJS en un MFE; rompen la federación en runtime.