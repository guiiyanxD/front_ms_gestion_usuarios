import { NxWelcome } from './nx-welcome';
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('profile/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'profile',
    loadChildren: () => import('profile/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcome,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.page').then((m) => m.LoginPage),
  },

  // Área protegida: aquí colgarán los MFEs remotos tras login válido.
  // El guard vive en estas rutas, NO en la redirección.
  // {
  //   path: 'users',
  //   canActivate: [authGuard],
  //   loadChildren: () => loadRemote(...),
  // },

  // La raíz solo redirige. Sin canActivate.
  //{ path: '', pathMatch: 'full', redirectTo: 'login' },

  // Cualquier ruta desconocida vuelve al login.
  { path: '**', redirectTo: 'login' },
];
