import { Route } from '@angular/router';
import { SolicitudesPage } from '../solicitudes/presentation/solicitudes.page';
import { SolicitudDetailPage } from '../solicitudes/presentation/solicitud-detail.page';
import { MisSolicitudesPage } from '../solicitudes/presentation/mis-solicitudes.page';
import { provideSolicitudes } from '../solicitudes/solicitudes.providers';
import { provideMantenimientos } from '../mantenimientos/mantenimientos.providers';
import { SolicitudesStore } from '../solicitudes/state/solicitudes.store';
import { MantenimientosStore } from '../mantenimientos/state/mantenimientos.store';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [
      ...provideSolicitudes(),
      ...provideMantenimientos(),
      SolicitudesStore,
      MantenimientosStore,
    ],
    children: [
      { path: '', component: SolicitudesPage },
      { path: 'mis-solicitudes', component: MisSolicitudesPage },
      { path: ':id', component: SolicitudDetailPage },
    ],
  },
];
