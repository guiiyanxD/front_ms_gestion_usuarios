import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RoleTableComponent } from './ui/role-table/role-table.component';
import { RoleFormComponent } from './ui/role-form/role-form.component';
import { RolesStore } from '../state/roles.store';
import { Role, RoleInput } from '../domain/models/role.model';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [RoleTableComponent, RoleFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roles.page.html',
  styleUrl: './roles.page.css',
})
export class RolesPage implements OnInit {
  private readonly store = inject(RolesStore);

  readonly roles = this.store.roles;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly isSaving = this.store.isSaving;

  readonly showForm = signal(false);

  ngOnInit(): void {
    this.store.load();
  }

  onNew(): void { this.showForm.set(true); }
  onCancel(): void { this.showForm.set(false); }

  onSubmit(input: RoleInput): void {
    this.store.create(input);
    this.showForm.set(false);
  }

  onDelete(role: Role): void {
    if (confirm(`¿Eliminar el rol "${role.name}"?`)) {
      this.store.remove(role.id);
    }
  }
}
