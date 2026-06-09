import { computed, inject, Injectable, signal } from '@angular/core';
import { ListMaintenancesByUserUseCase } from '../domain/use-cases/list-by-user.use-case';
import { ListMaintenancesByRequestUseCase } from '../domain/use-cases/list-by-request.use-case';
import { TomarResponsabilidadUseCase } from '../domain/use-cases/tomar-responsabilidad.use-case';
import { DeleteMaintenanceUseCase } from '../domain/use-cases/delete-maintenance.use-case';
import { UpdateMaintenanceUseCase } from '../domain/use-cases/update-maintenance.use-case';
import { Maintenance, CreateMaintenanceInput, UpdateMaintenanceInput } from '../domain/models/maintenance.model';
import { UserOption } from '../../shared/user-option/user-option.model';
import { ListUserOptionsUseCase } from '../../shared/user-option/list-user-options.use-case';

type Status = 'idle' | 'loading' | 'saving' | 'error';

@Injectable()
export class MantenimientosStore {
  private readonly listByUserUC = inject(ListMaintenancesByUserUseCase);
  private readonly listByRequestUC = inject(ListMaintenancesByRequestUseCase);
  private readonly tomarUC = inject(TomarResponsabilidadUseCase);
  private readonly deleteUC = inject(DeleteMaintenanceUseCase);
  private readonly updateUC = inject(UpdateMaintenanceUseCase);
  private readonly listUsersUC = inject(ListUserOptionsUseCase);

  private readonly _maintenances = signal<Maintenance[]>([]);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _userOptions = signal<UserOption[]>([]);

  readonly maintenances = this._maintenances.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly userOptions = this._userOptions.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isSaving = computed(() => this._status() === 'saving');

  loadByUser(userId: string): void {
    this._status.set('loading');
    this._error.set(null);
    this.listByUserUC.execute(userId).subscribe({
      next: (m) => { this._maintenances.set(m); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar los mantenimientos.'); },
    });
  }

  loadByRequest(requestId: string): void {
    this._status.set('loading');
    this._error.set(null);
    this.listByRequestUC.execute(requestId).subscribe({
      next: (m) => { this._maintenances.set(m); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar los mantenimientos.'); },
    });
  }

  tomar(input: CreateMaintenanceInput, onSuccess: () => void): void {
    this._status.set('saving');
    this._error.set(null);
    this.tomarUC.execute(input).subscribe({
      next: () => onSuccess(),
      error: () => { this._status.set('error'); this._error.set('No se pudo tomar la solicitud.'); },
    });
  }

  update(id: string, input: UpdateMaintenanceInput, onSuccess: () => void): void {
    this._status.set('saving');
    this._error.set(null);
    this.updateUC.execute(id, input).subscribe({
      next: () => onSuccess(),
      error: () => { this._status.set('error'); this._error.set('No se pudo actualizar el mantenimiento.'); },
    });
  }

  remove(id: string, onSuccess: () => void): void {
    this._status.set('saving');
    this._error.set(null);
    this.deleteUC.execute(id).subscribe({
      next: () => onSuccess(),
      error: () => { this._status.set('error'); this._error.set('No se pudo eliminar el mantenimiento.'); },
    });
  }

  loadUserOptions(): void {
    this.listUsersUC.execute().subscribe({ next: (u) => this._userOptions.set(u), error: () => {} });
  }
}
