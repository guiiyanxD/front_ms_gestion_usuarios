import { Route } from '@angular/router';
import { RolesPage } from '../roles/presentation/roles.page';
import { provideRoles } from '../roles/roles.providers';
import { RolesStore } from '../roles/state/roles.store';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RolesPage,
    providers: [...provideRoles(), RolesStore],
  },
];