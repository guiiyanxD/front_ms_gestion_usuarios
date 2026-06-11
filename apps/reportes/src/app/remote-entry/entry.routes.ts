import { Route } from '@angular/router';
import { ReportesPage } from '../reportes/presentation/reportes.page';
import { provideReportes } from '../reportes/reportes.providers';
import { ReportesStore } from '../reportes/state/reportes.store';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [...provideReportes(), ReportesStore],
    children: [
      { path: '', component: ReportesPage },
    ],
  },
];
