import { Route } from '@angular/router';
import { DashboardPage } from '../dashboard/presentation/dashboard.page';
import { provideDashboard } from '../dashboard/dashboard.providers';
import { DashboardStore } from '../dashboard/state/dashboard.store';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [...provideDashboard(), DashboardStore],
    component: DashboardPage,
  },
];
