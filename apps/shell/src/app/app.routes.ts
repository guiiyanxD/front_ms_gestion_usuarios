import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { guestGuard } from './core/auth/guards/guest.guard';

export const appRoutes: Routes = [
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('users/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    loadChildren: () => import('roles/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('profile/Routes').then((m) => m.remoteRoutes),
  },

  {
    path: 'activos-fijos',
    canActivate: [authGuard],
    loadChildren: () => import('activos-fijos/Routes').then((m) => m.remoteRoutes),
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
