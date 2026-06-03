import { Route } from '@angular/router';
import { ActivosPage } from '../activos/presentation/activos.page';
import { ActivoDetailPage } from '../activos/presentation/activo-detail.page';
import { provideActivos } from '../activos/activos.providers';
import { ActivosStore } from '../activos/state/activos.store';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [...provideActivos(), ActivosStore],
    children: [
      { path: '', component: ActivosPage },
      { path: ':id', component: ActivoDetailPage },
    ],
  },
];
