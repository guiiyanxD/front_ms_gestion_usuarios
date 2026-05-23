import { computed, inject, Injectable, signal } from '@angular/core';
import { ListUsersUseCase } from '../domain/use-cases/list-users.use-case';
import { CreateUserUseCase } from '../domain/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../domain/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../domain/use-cases/delete-user.use-case';
import { ListRoleOptionsUseCase } from '../domain/use-cases/list-role-options.use-case';
import { User, CreateUserInput, UpdateUserInput, RoleOption } from '../domain/models/user.model';

type Status = 'idle' | 'loading' | 'saving' | 'error';

@Injectable()
export class UsersStore {
  private readonly listUC = inject(ListUsersUseCase);
  private readonly createUC = inject(CreateUserUseCase);
  private readonly updateUC = inject(UpdateUserUseCase);
  private readonly deleteUC = inject(DeleteUserUseCase);
  private readonly rolesUC = inject(ListRoleOptionsUseCase);

  private readonly _users = signal<User[]>([]);
  private readonly _roleOptions = signal<RoleOption[]>([]);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);

  readonly users = this._users.asReadonly();
  readonly roleOptions = this._roleOptions.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isSaving = computed(() => this._status() === 'saving');

  load(): void {
    this._status.set('loading');
    this._error.set(null);
    this.listUC.execute().subscribe({
      next: (users) => { this._users.set(users); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar los usuarios.'); },
    });
  }

  loadRoleOptions(): void {
    this.rolesUC.execute().subscribe({
      next: (roles) => this._roleOptions.set(roles),
      error: () => this._error.set('No se pudieron cargar los roles para el selector.'),
    });
  }

  create(input: CreateUserInput): void {
    this._status.set('saving');
    this.createUC.execute(input).subscribe({
      next: () => this.load(),
      error: () => { this._status.set('error'); this._error.set('No se pudo crear el usuario.'); },
    });
  }

  update(id: string, input: UpdateUserInput): void {
    this._status.set('saving');
    this.updateUC.execute(id, input).subscribe({
      next: () => this.load(),
      error: () => { this._status.set('error'); this._error.set('No se pudo actualizar el usuario.'); },
    });
  }

  remove(id: string): void {
    this._status.set('saving');
    this.deleteUC.execute(id).subscribe({
      next: () => this.load(),
      error: () => { this._status.set('error'); this._error.set('No se pudo eliminar el usuario.'); },
    });
  }
}