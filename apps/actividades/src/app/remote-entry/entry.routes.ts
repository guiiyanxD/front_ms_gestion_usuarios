import { Route } from '@angular/router';
import { ActividadesPage } from '../actividades/presentation/actividades.page';
import { provideActividades } from '../actividades/actividades.providers';
import { ActividadesStore } from '../actividades/state/actividades.store';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [...provideActividades(), ActividadesStore],
    children: [
      { path: '', component: ActividadesPage },
    ],
  },
];
