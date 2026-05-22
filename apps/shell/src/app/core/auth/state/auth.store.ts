// core/auth/state/auth.store.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUseCase } from '../domain/use-cases/login.use-case';
import { LogoutUseCase } from '../domain/use-cases/logout.use-case';
import { TokenStorageService } from '../data/storage/token-storage.service';
import { Credentials } from '../domain/models/credentials.model';
import { Session } from '../domain/models/session.model';

type Status = 'idle' | 'loading' | 'error';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly storage = inject(TokenStorageService);
  private readonly router = inject(Router);

  private readonly _session = signal<Session | null>(this.storage.get());
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);

  readonly session = this._session.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() => !!this._session());
  readonly currentUser = computed(() => this._session()?.user ?? null);
  readonly roles = computed(() => this._session()?.user.roles ?? []);

  login(credentials: Credentials): void {
    this._status.set('loading');
    this._error.set(null);
    this.loginUseCase.execute(credentials).subscribe({
      next: (session) => {
        this.storage.save(session);
        this._session.set(session);
        this._status.set('idle');
        this.router.navigate(['/']);
      },
      error: () => {
        this._status.set('error');
        this._error.set('Usuario o contraseña incorrectos.');
      },
    });
  }

  logout(): void {
    this.logoutUseCase.execute().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(), // limpiamos sesión local pase lo que pase
    });
  }

  private finishLogout(): void {
    this.storage.clear();
    this._session.set(null);
    this.router.navigate(['/login']);
  }
}