import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { UserTableComponent } from './ui/user-table/user-table.component';
import { UserFormComponent } from './ui/user-form/user-form.component';
import { UsersStore } from '../state/users.store';
import { User, CreateUserInput, UpdateUserInput } from '../domain/models/user.model';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserTableComponent, UserFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users.page.html',
  styleUrl: './users.page.css',
})
export class UsersPage implements OnInit {
  private readonly store = inject(UsersStore);

  readonly users = this.store.users;
  readonly roleOptions = this.store.roleOptions;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly isSaving = this.store.isSaving;

  readonly showForm = signal(false);
  readonly editing = signal<User | null>(null);

  ngOnInit(): void {
    this.store.load();
    this.store.loadRoleOptions();
  }

  onNew(): void { this.editing.set(null); this.showForm.set(true); }
  onEdit(user: User): void { this.editing.set(user); this.showForm.set(true); }
  onCancel(): void { this.showForm.set(false); this.editing.set(null); }

  onDelete(user: User): void {
    if (confirm(`¿Eliminar al usuario "${user.firstName} ${user.lastName}"?`)) {
      this.store.remove(user.id);
    }
  }

  onSubmit(input: CreateUserInput | UpdateUserInput): void {
    const current = this.editing();
    if (current) {
      this.store.update(current.id, input as UpdateUserInput);
    } else {
      this.store.create(input as CreateUserInput);
    }
    this.showForm.set(false);
    this.editing.set(null);
  }
}
