import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { guestGuard } from './core/auth/guards/guest.guard';
import { roleGuard } from './core/auth/guards/role.guard';

export const appRoutes: Routes = [
  {
    path: 'actividades',
    canActivate: [authGuard, roleGuard(['SUPERADMIN', 'GERENTE'])],
    loadChildren: () =>
      import('actividades/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'reportes',
    canActivate: [authGuard, roleGuard(['SUPERADMIN', 'GERENTE'])],
    loadChildren: () => import('reportes/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('users/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    loadChildren: () => import('roles/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('profile/Routes').then((m) => m.remoteRoutes),
  },

  {
    path: 'activos-fijos',
    canActivate: [authGuard],
    loadChildren: () =>
      import('activos-fijos/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'mantenimientos',
    canActivate: [authGuard],
    loadChildren: () =>
      import('mantenimientos/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'estadisticas',
    canActivate: [authGuard],
    loadChildren: () =>
      import('estadisticas/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/login/login.page').then((m) => m.LoginPage),
  },
  { path: '**', redirectTo: 'login' },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
