# Guía de Desarrollo — Sistema de Gestión (Angular Micro-Frontends)

Documento de referencia para entender la arquitectura, montar el entorno y desarrollar nuevos micro-frontends (MFE) en este proyecto. Está pensado para que un desarrollador que se incorpora pueda ser autónomo: comprender las decisiones, replicar el patrón establecido y añadir nuevos módulos sin romper las convenciones.

> **Estado actual del proyecto:** Shell (Host) con autenticación, barra de navegación con menú dinámico por rol, MFE de Perfil y MFE de Roles (CRUD) funcionando. Pendientes: MFE de Usuarios y futuros módulos de negocio.

---

## Índice

1. [Visión de la arquitectura](#1-visión-de-la-arquitectura)
2. [Stack y versiones](#2-stack-y-versiones)
3. [Montaje del entorno](#3-montaje-del-entorno)
4. [Clean Architecture: las tres capas](#4-clean-architecture-las-tres-capas)
5. [Convenciones del proyecto](#5-convenciones-del-proyecto)
6. [Particularidades del API](#6-particularidades-del-api)
7. [Receta: crear un nuevo MFE paso a paso](#7-receta-crear-un-nuevo-mfe-paso-a-paso)
8. [Autenticación, sesión y seguridad](#8-autenticación-sesión-y-seguridad)
9. [Menú dinámico por rol](#9-menú-dinámico-por-rol)
10. [Desarrollo, proxy y CORS](#10-desarrollo-proxy-y-cors)
11. [Despliegue](#11-despliegue)
12. [Solución de problemas frecuentes](#12-solución-de-problemas-frecuentes)

---

## 1. Visión de la arquitectura

El sistema es un conjunto de micro-frontends Angular integrados mediante Module Federation, orquestados en un monorepo Nx. Consume un backend de microservicios Spring Boot a través de un único API Gateway.

Reglas arquitectónicas innegociables:

- **El navegador nunca habla directamente con un microservicio.** Todo el tráfico va al API Gateway, que valida el JWT y enruta.
- **El Shell (Host) es el único dueño de la sesión.** Gestiona login, token JWT, interceptor global, guards y la barra de navegación. Los MFEs remotos solo consumen el token a través del interceptor del Host.
- **Cada MFE es independiente en despliegue.** Se construye y publica por separado; el Shell los integra en runtime mediante carga perezosa.
- **Separación estricta en tres capas** (Domain, Data, Presentation) en cada feature, sin mezcla de responsabilidades.

Estructura de alto nivel:

```
gestion-workspace/
├── apps/
│   ├── shell/        # HOST: login, sesión, navbar, guards, interceptor
│   ├── profile/      # MFE remoto: perfil del usuario
│   ├── roles/        # MFE remoto: CRUD de roles
│   └── <nuevo-mfe>/  # los que se vayan añadiendo
├── libs/
│   └── shared/ui/    # tokens de diseño y componentes compartidos
├── nx.json
└── docker-compose.yml
```

---

## 2. Stack y versiones

| Herramienta | Versión          | Notas                                          |
|-------------|------------------|------------------------------------------------|
| Node.js     | 22 LTS (≥22.22.0)| Fijar con `nvm` y `.nvmrc`                      |
| npm         | 10.x             | Incluido con Node                              |
| Nx          | 22.x             | `@nx/angular` + `@nx/module-federation`        |
| Angular     | 21.x             | Standalone components, Signals, control flow `@if`/`@for` |
| TypeScript  | ≥5.8             |                                                |
| RxJS        | 7.8.x            | El dominio usa `Observable`                    |
| Docker      | Engine 24+       | Para integración y build de producción         |

Verificación rápida del entorno:

```bash
node -v            # v22.x
npm -v             # 10.x
npx nx report      # nx y @nx/angular deben coincidir en versión
npx nx show projects   # debe listar todos los proyectos del workspace
```

---

## 3. Montaje del entorno

Si el repositorio ya existe (caso normal para quien se incorpora):

```bash
# 1. Fijar Node correcto
nvm use            # lee .nvmrc → Node 22

# 2. Instalar dependencias
npm install

# 3. Verificar que Nx reconoce todos los proyectos
npx nx show projects

# 4. Levantar el Shell con el proxy (resuelve CORS en desarrollo)
npx nx serve shell --proxy-config apps/shell/proxy.conf.json
```

El Shell levanta en `http://localhost:4200`. El servidor de desarrollo tiene hot reload: los cambios en código (componentes, servicios, estilos) se reflejan solos. Solo hay que reiniciar el proceso al tocar configuración (rutas de federación, environments, `nx.json`, `tsconfig`) o al añadir un MFE nuevo.

> **No se desarrolla dentro de Docker.** Docker es solo para integración con el Gateway y validación del build de producción. El día a día es `nx serve`.

---

## 4. Clean Architecture: las tres capas

Cada feature (en el Host o en un MFE) se organiza en tres capas con responsabilidades estrictamente separadas.

**Domain (Dominio).** Modelos de datos, interfaces de repositorio (abstractas) y casos de uso. CERO dependencias de framework: no importa nada de `@angular/core` ni de `@angular/common/http`. Solo se permite `rxjs` (`Observable`), por ser el lenguaje de I/O asíncrono de Angular y mantenerse agnóstico del framework. Esta capa es casi idéntica si el día de mañana se replica en React Native.

**Data (Infraestructura).** Comunicación con el API Gateway. Aquí viven: los DTOs (que reflejan la forma exacta del API), los mappers (DTO → modelo de dominio), las implementaciones concretas de los repositorios (que usan `HttpClient`), y el storage. Es la ÚNICA capa que conoce las URLs del Gateway. Nunca apunta a un microservicio directo.

**Presentation (Presentación).** Componentes visuales y estado. Se divide en:
- **Smart components** (páginas): conectados al estado (Store de Signals) y a los casos de uso. Orquestan.
- **Dumb components** (UI): solo reciben datos por `input()` y emiten eventos por `output()`. No conocen el store ni los casos de uso. Solo renderizan.

El estado se gestiona con **Signals** (Angular) mediante un Store inyectable.

Flujo de una operación típica:

```
Componente Smart → Store (Signals) → Caso de uso (Domain) → Repositorio (interfaz Domain)
                                                                  ↓ (implementación en Data)
                                                          HttpClient → API Gateway
```

La conexión entre la interfaz abstracta del dominio y su implementación concreta se hace por **inyección de dependencias** mediante un `InjectionToken` y una función `provide<Feature>()`. Esto permite sustituir la implementación por un mock en tests con una sola línea.

---

## 5. Convenciones del proyecto

Reglas que todo MFE nuevo debe respetar para mantener la coherencia:

- **Layout del monorepo:** clásico `apps/` (desplegables) + `libs/` (compartido). Al generar, pasar la ruta completa como nombre: `nx g @nx/angular:remote apps/<nombre> --host=shell`.
- **Estructura interna de un feature:** `domain/{models,repositories,use-cases}`, `data/{dto,mappers,repositories}`, `state/`, `presentation/{ui}`, más un archivo `<feature>.providers.ts` para el wiring de DI.
- **Componentes:** standalone, con `ChangeDetectionStrategy.OnPush`. Smart vs Dumb bien diferenciados.
- **Estado:** Signals mediante un Store `@Injectable()` (NO `providedIn: 'root'` en MFEs — ver sección 12). El Store se provee en la ruta del remoto.
- **Sintaxis moderna:** control de flujo `@if`, `@for`, `@empty`; `input()`, `output()`, `inject()`.
- **Paleta de colores:** `#4338ca` (primario), `#0f172a` (tinta), `#e0e7ff` (primario suave), `#f1f5f9` (superficie), `#c5e6a6` (acento). Sin animaciones. Foco visible y atributos `aria-*` para accesibilidad.
- **Tokens CSS:** definidos en `libs/shared/ui/src/lib/tokens/theme.css` (`--color-primary`, `--radius`, etc.). Usarlos en lugar de hardcodear.
- **Rutas relativas al Gateway:** el `environment` de cada MFE usa `apiGatewayUrl: '/api'`. El prefijo `/api` lo resuelve el proxy en desarrollo y Nginx en producción (ver sección 10).

---

## 6. Particularidades del API

El backend tiene convenciones propias que hay que respetar al escribir los DTOs y mappers. Confirmar siempre la respuesta real (con Postman/Swagger) antes de codificar un DTO.

**Convención de nombres:** el API responde en `camelCase` (`accessToken`, `createdAt`), NO en `snake_case`.

**Respuesta del login** (`POST /auth/login`):

```json
{
  "user": { "id": "uuid", "username": "haroldcorp", "role": "superadmin" },
  "accessToken": "jwt...",
  "refreshToken": "jwt..."
}
```

Notas: el usuario trae un único `role` (string, no array). No hay `fullName`, `email`, `permissions` ni fecha de expiración explícita (la expiración está dentro del JWT en el claim `exp`).

**Listados paginados:** los listados vienen envueltos en un objeto con `data`, `total`, `page`, `size`. Por ejemplo, `GET /roles`:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "superadmin",
      "createdAt": "2026-05-21T00:10:28.372Z",
      "updateAt": "2026-05-21T00:10:28.372Z",
      "deletedAt": null,
      "createdBy": "system",
      "updatedBy": null,
      "deletedBy": null
    }
  ],
  "total": 1, "page": 1, "size": 10
}
```

Notas: hay campos de auditoría (`createdAt`, `updateAt` —sin "d"—, `deletedAt`, `createdBy`, etc.) que normalmente NO se mapean al dominio salvo que se necesiten. El mapper extrae solo lo relevante.

**Implicación práctica:** el DTO refleja la forma cruda del API (con todos sus campos y su `camelCase`), y el mapper traduce a un modelo de dominio limpio y mínimo. Si un endpoint nuevo devuelve una estructura distinta, se ajusta el DTO y el mapper, nunca el dominio ni la presentación.

---

## 7. Receta: crear un nuevo MFE paso a paso

Esta es la receta repetible. Como ejemplo se usa un MFE hipotético llamado `products`, pero aplica a cualquiera (Usuarios, etc.).

### Paso 0 — Confirmar el contrato del API

Antes de escribir código, obtener con Postman/Swagger las respuestas reales de los endpoints (listado, detalle, crear, actualizar). Anotar la estructura exacta (campos, anidación, paginación). Esto evita reescribir DTOs después.

### Paso 1 — Generar el remoto

Con el `nx serve` detenido y el editor sin bloquear carpetas (importante en Windows):

```bash
npx nx g @nx/angular:remote apps/products --host=shell --style=css
```

Cuando pregunte por test runner, usar `vitest` (coherente con el resto). Verificar:

```bash
npx nx show projects   # debe aparecer 'products'
```

Asegurar que `apps/products/src/environments/environment.ts` tenga `apiGatewayUrl: '/api'`.

### Paso 2 — Crear la estructura de carpetas

```bash
cd apps/products/src/app
mkdir -p products/domain/models products/domain/repositories products/domain/use-cases
mkdir -p products/data/dto products/data/mappers products/data/repositories
mkdir -p products/state products/presentation/ui
cd ../../../..
```

### Paso 3 — Domain

Crear el modelo, la interfaz abstracta del repositorio y los casos de uso (uno por operación). El repositorio es una clase `abstract`; los casos de uso reciben el repositorio por constructor y exponen un método `execute()`.

### Paso 4 — Data

Crear el DTO (reflejando el API real, recordar `camelCase` y paginación si aplica), el mapper (DTO → dominio), y la implementación del repositorio (`@Injectable()` que extiende la abstracta, usa `HttpClient` e inyecta la URL del Gateway vía token). El token JWT se inyecta solo por el interceptor del Host; el repositorio no lo maneja.

### Paso 5 — Wiring de DI

Crear `products.providers.ts` con un `InjectionToken` para la URL del Gateway y una función `provideProducts()` que registre: la URL, la implementación del repositorio (atada a la interfaz abstracta) y cada caso de uso vía `useFactory`.

### Paso 6 — Estado (Signals)

Crear el Store `@Injectable()` (sin `providedIn: 'root'`). Mantiene signals privados de datos/estado/error, expone versiones de solo lectura y `computed`, y métodos que invocan los casos de uso y actualizan los signals.

### Paso 7 — Presentation

Crear los Dumb components (tabla, formulario, etc.) que solo usan `input()`/`output()`, y el Smart component (página) que inyecta el Store, orquesta y compone los Dumb. Aplicar la paleta y los tokens CSS.

### Paso 8 — Conectar al Host

En `apps/products/src/app/remote-entry/entry.routes.ts`, exponer la página con sus providers:

```typescript
import { Route } from '@angular/router';
import { ProductsPage } from '../products/presentation/products.page';
import { provideProducts } from '../products/products.providers';
import { ProductsStore } from '../products/state/products.store';

export const remoteRoutes: Route[] = [
  { path: '', component: ProductsPage, providers: [...provideProducts(), ProductsStore] },
];
```

En `apps/shell/src/app/app.routes.ts`, añadir la ruta protegida (el generador suele añadir el `loadChildren`; asegurar el `canActivate`):

```typescript
{
  path: 'products',
  canActivate: [authGuard],
  loadChildren: () => import('products/Routes').then((m) => m.remoteRoutes),
},
```

### Paso 9 — Añadir al menú (si aplica)

En `apps/shell/src/app/core/layout/navbar/navbar.component.ts`, añadir la entrada al catálogo `allItems`, declarando qué roles pueden verla:

```typescript
{ label: 'Productos', path: '/products', roles: ['superadmin'] },
```

### Paso 10 — Probar

Reiniciar el `nx serve` completo (cambió el grafo de federación), iniciar sesión y navegar al nuevo MFE. Verificar en la pestaña Network que las peticiones lleguen al Gateway con el token.

---

## 8. Autenticación, sesión y seguridad

- **El Login vive en el Shell**, no en un remoto, para evitar la dependencia inversa (cargar un remoto antes de tener sesión).
- **El token JWT** se guarda en `sessionStorage` (sobrevive a recargas, se borra al cerrar la pestaña). Se eligió por reducir superficie XSS frente a `localStorage`. Si el Gateway soporta cookie `HttpOnly`, esa sería la opción más robusta.
- **El interceptor global** (`auth.interceptor.ts`) vive en el Host y añade la cabecera `Authorization: Bearer <token>` a TODA petición saliente. Los MFEs no manejan el token.
- **Guards:**
  - `authGuard`: protege rutas privadas; sin sesión redirige a `/login`.
  - `guestGuard`: inverso; si hay sesión, impide ver `/login` y redirige a `/profile`.
  - `roleGuard(roles[])`: protege rutas por rol (base para restricciones más finas).
- **El estado de sesión** (`AuthStore`) expone `isAuthenticated()`, `currentUser()` y `roles()`, consumidos por la navbar y los guards.

> Recordatorio de seguridad: la validación del frontend (longitud de contraseña, etc.) es solo para UX. La validación real de seguridad vive en el backend, detrás del Gateway.

---

## 9. Menú dinámico por rol

La barra de navegación (`navbar.component.ts`) implementa el menú dinámico. Cada entrada del catálogo `allItems` declara opcionalmente qué roles pueden verla:

```typescript
private readonly allItems: MenuItem[] = [
  { label: 'Perfil', path: '/profile' },                       // visible para todos
  { label: 'Roles', path: '/roles', roles: ['superadmin'] },   // solo superadmin
];
```

Un `computed` (`visibleItems`) filtra las entradas según los roles del usuario actual (`AuthStore.roles()`). Una entrada sin `roles` es visible para cualquier usuario autenticado.

Para añadir un módulo al menú: agregar su entrada a `allItems` con los roles permitidos. El filtrado es automático. Adicionalmente, la ruta debe protegerse con `authGuard` (y opcionalmente `roleGuard`) en el Host, porque ocultar el menú no es suficiente: hay que bloquear el acceso por URL directa.

---

## 10. Desarrollo, proxy y CORS

En desarrollo, el frontend (`localhost:4200`) y el Gateway están en orígenes distintos, lo que dispara CORS. Se resuelve con el **proxy de Nx**, que reenvía las peticiones servidor-a-servidor (sin navegador aplicando CORS).

Archivo `apps/shell/proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://<host-del-gateway>",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" }
  }
}
```

Mecanismo: el código usa `apiGatewayUrl: '/api'`, por lo que las peticiones salen como `/api/auth/login`. El proxy las intercepta (por el prefijo `/api`), les quita ese prefijo (`pathRewrite`) y las reenvía al Gateway como `/auth/login`. El prefijo `/api` solo existe del lado del navegador; el Gateway recibe la ruta limpia.

Levantar con el proxy:

```bash
npx nx serve shell --proxy-config apps/shell/proxy.conf.json
```

(o configurar `proxyConfig` en el target `serve` del `project.json` para no pasar el flag cada vez).

En **producción** no existe el proxy de Nx. Las opciones son: mantener el prefijo `/api` y que un Nginx haga el mismo reenvío (recomendado, evita CORS y mantiene mismo origen), o usar la URL absoluta del Gateway y configurar CORS en el backend para aceptar el origen del frontend.

---

## 11. Despliegue

Cada MFE (y el Shell) se construye y despliega de forma independiente:

1. **Build:** cada proyecto produce su propia imagen Docker (etapa de build con `nx build <proyecto> --configuration=production`, etapa final con Nginx sirviendo los estáticos).
2. **Deploy:** cada contenedor se publica en su propia URL. El Shell en la URL principal; cada MFE expone su `remoteEntry` en su dirección.
3. **Runtime:** el navegador carga el Shell, que descubre y carga perezosamente los `remoteEntry.js` de cada MFE según la ruta y el rol.

Cada `Dockerfile` necesita un `nginx.conf` con `try_files $uri $uri/ /index.html;` para que el routing de Angular funcione. En producción, ese Nginx también debe reescribir `/api` hacia el Gateway si se mantiene esa convención.

Punto crítico de dependencias compartidas: Angular y RxJS se comparten en runtime entre Shell y remotos, por lo que deben mantenerse en versiones compatibles. El monorepo Nx centraliza esto; no introducir versiones divergentes en un MFE.

---

## 12. Solución de problemas frecuentes

**`Cannot find remote "<nombre>"`** — El remoto no está en el array `remotes` del `apps/shell/module-federation.config.ts`, o el proyecto no está registrado en Nx. Verificar con `npx nx show projects`. Si el proyecto no aparece, la generación quedó incompleta: borrar y regenerar (ver siguiente punto).

**El proyecto no aparece en `nx show projects`** — La generación del remoto se interrumpió (común en Windows si el `nx serve` o el editor bloquean archivos). Solución: `npx nx reset`, borrar `apps/<nombre>`, cerrar editor y servidor, y regenerar `nx g @nx/angular:remote apps/<nombre> --host=shell`. Confirmar que el dry-run incluya `CREATE apps/<nombre>/project.json`.

**El remoto muestra la pantalla de bienvenida de Nx** — El `entry.routes.ts` del remoto apunta al `RemoteEntry`/`NxWelcome` por defecto. Cambiarlo para que cargue la página real del feature con sus providers (ver Paso 8).

**`No provider found for <UseCase>`** (NG0201) — El Store está como `providedIn: 'root'` pero sus dependencias se proveen a nivel de ruta. Solución: quitar `providedIn: 'root'` del Store (dejarlo `@Injectable()`) y añadirlo a los `providers` de la ruta del remoto junto a `provide<Feature>()`.

**Pantalla en blanco tras login / URL congelada** — Suele ser un error de runtime: un mapper que falla porque la respuesta del API no coincide con el DTO (revisar `camelCase` y estructura real), o un bucle de redirección (la raíz `''` redirige a `login` mientras el store navega a `/`). Revisar la consola del navegador para el error exacto.

**Página vacía / sin `<router-outlet>`** — El `app.html` del host debe contener el outlet. Tras generar el host, Nx deja contenido de demostración; limpiarlo y dejar el layout (navbar condicional + `<router-outlet>`).

**Error de CORS** — Usar el proxy de Nx en desarrollo (sección 10). Si persiste un 404 tras el proxy, verificar el `pathRewrite` y que la ruta exista realmente en el Gateway (probar con Postman, que no aplica CORS).

**`'routing' is not found in schema`** — En Nx 22 el generador `host` ya no acepta `--routing`. Omitir el flag.

**Datos vacíos en la UI pese a respuesta correcta** — El DTO/mapper no coincide con la forma real del API. Comparar la respuesta de Network con el DTO y ajustar mapper.

---

## Apéndice: comandos de referencia rápida

```bash
# Entorno
nvm use
npm install
npx nx report
npx nx show projects

# Desarrollo
npx nx serve shell --proxy-config apps/shell/proxy.conf.json

# Generar un nuevo MFE
npx nx g @nx/angular:remote apps/<nombre> --host=shell --style=css

# Ver flags válidos del generador en tu versión
npx nx g @nx/angular:remote --help

# Limpiar caché (ante problemas de grafo)
npx nx reset

# Build de producción de un proyecto
npx nx build <proyecto> --configuration=production

# Integración con Docker
docker compose up --build
```
