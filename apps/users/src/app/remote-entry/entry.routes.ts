import { Route } from '@angular/router';
import { UsersPage } from '../users/presentation/users.page';
import { provideUsers } from '../users/users.providers';
import { UsersStore } from '../users/state/users.store';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: UsersPage,
    providers: [...provideUsers(), UsersStore],
  },
];