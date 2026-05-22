import { NxWelcome } from './nx-welcome';
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: NxWelcome,
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then((m) => m.LoginPage),
  },
  // MFEs remotos protegidos — se cargarán perezosamente tras login válido:
  // { path: 'users', canActivate: [authGuard], loadChildren: () => loadRemote(...) },
  { path: '', canActivate: [authGuard], pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];