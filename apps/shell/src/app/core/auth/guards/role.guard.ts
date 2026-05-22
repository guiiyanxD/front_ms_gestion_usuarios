// core/auth/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

/**
 * Protege rutas por rol. El menú dinámico por rol se construirá sobre esta misma base.
 */
export const roleGuard = (allowed: string[]): CanActivateFn => {
  return () => {
    const store = inject(AuthStore);
    const router = inject(Router);
    const userRoles = store.roles();
    const ok = allowed.some((r) => userRoles.includes(r));
    return ok ? true : router.createUrlTree(['/']);
  };
};