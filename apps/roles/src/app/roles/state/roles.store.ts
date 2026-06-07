import { computed, inject, Injectable, signal } from '@angular/core';
import { ListRolesUseCase } from '../domain/use-cases/list-roles.use-case';
import { CreateRoleUseCase } from '../domain/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from '../domain/use-cases/delete-role.use-case';
import { Role, RoleInput } from '../domain/models/role.model';

type Status = 'idle' | 'loading' | 'saving' | 'error';

@Injectable()
export class RolesStore {
  private readonly listUC = inject(ListRolesUseCase);
  private readonly createUC = inject(CreateRoleUseCase);
  private readonly deleteUC = inject(DeleteRoleUseCase);

  private readonly _roles = signal<Role[]>([]);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);

  readonly roles = this._roles.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isSaving = computed(() => this._status() === 'saving');

  load(): void {
    this._status.set('loading');
    this._error.set(null);
    this.listUC.execute().subscribe({
      next: (roles) => { this._roles.set(roles); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar los roles.'); },
    });
  }

  create(input: RoleInput): void {
    this._status.set('saving');
    this.createUC.execute(input).subscribe({
      next: () => this.load(),
      error: () => { this._status.set('error'); this._error.set('No se pudo crear el rol.'); },
    });
  }

  remove(id: string): void {
    this._status.set('saving');
    this.deleteUC.execute(id).subscribe({
      next: () => this.load(),
      error: () => { this._status.set('error'); this._error.set('No se pudo eliminar el rol.'); },
    });
  }
}
