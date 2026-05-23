import { Route } from '@angular/router';
import { provideProfile } from './profile/profile.providers';
import { ProfilePage } from './profile/presentation/profile.page';


export const appRoutes: Route[] = [
  {
    path: '',
    component: ProfilePage,
    providers: [...provideProfile()],
  },
];
