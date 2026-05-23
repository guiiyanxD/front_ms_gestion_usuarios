// apps/profile/src/app/remote-entry/entry.routes.ts
import { Route } from '@angular/router';
import { ProfilePage } from '../profile/presentation/profile.page';
import { provideProfile } from '../profile/profile.providers';
import { ProfileStore } from '../profile/state/profile.store';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: ProfilePage,
    providers: [...provideProfile(), ProfileStore],
  },
];