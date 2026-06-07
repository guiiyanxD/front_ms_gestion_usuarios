import { computed, inject, Injectable, signal } from '@angular/core';
import { GetProfileUseCase } from '../domain/use-cases/get-profile.use-case';
import { Profile } from '../domain/models/profile.model';

type Status = 'idle' | 'loading' | 'error';

// Lee el id del usuario autenticado desde la sesión que el shell persiste.
// No se importa AuthStore directamente porque en Module Federation cada bundle
// obtendría una instancia distinta del servicio, rompiendo el singleton del shell.
function currentUserId(): string | null {
  const raw = sessionStorage.getItem('gestion.session');
  if (!raw) return null;
  return (JSON.parse(raw) as { user: { id: string } }).user?.id ?? null;
}

@Injectable()
export class ProfileStore {
  private readonly getProfileUseCase = inject(GetProfileUseCase);

  private readonly _profile = signal<Profile | null>(null);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);

  readonly profile = this._profile.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');

  load(): void {
    const id = currentUserId();
    if (!id) {
      this._status.set('error');
      this._error.set('Sesión no encontrada.');
      return;
    }

    this._status.set('loading');
    this._error.set(null);
    this.getProfileUseCase.execute(id).subscribe({
      next: (profile) => {
        this._profile.set(profile);
        this._status.set('idle');
      },
      error: () => {
        this._status.set('error');
        this._error.set('No se pudo cargar el perfil.');
      },
    });
  }
}
