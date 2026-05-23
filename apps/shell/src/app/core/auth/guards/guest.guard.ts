import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

/**
 * Inverso de authGuard: si el usuario YA tiene sesión, no debe ver el login.
 * Lo redirige al perfil. Solo permite el paso a usuarios sin sesión.
 */
export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  return store.isAuthenticated() ? router.createUrlTree(['/profile']) : true;
};