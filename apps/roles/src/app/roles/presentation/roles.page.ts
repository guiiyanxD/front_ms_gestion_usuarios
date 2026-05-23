import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RoleTableComponent } from './ui/role-table/role-table.component';
import { RoleFormComponent } from './ui/role-form/role-form.component';
import { RolesStore } from '../state/roles.store';
import { Role, RoleInput } from '../domain/models/role.model';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [DatePipe, RoleTableComponent, RoleFormComponent],
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
  readonly editing = signal<Role | null>(null);

  ngOnInit(): void {
    this.store.load();
  }

  onNew(): void { this.editing.set(null); this.showForm.set(true); }
  onEdit(role: Role): void { this.editing.set(role); this.showForm.set(true); }
  onCancel(): void { this.showForm.set(false); this.editing.set(null); }

  onSubmit(input: RoleInput): void {
    const current = this.editing();
    if (current) {
      this.store.update(current.id, input);
    } else {
      this.store.create(input);
    }
    this.showForm.set(false);
    this.editing.set(null);
  }

  onDelete(role: Role): void {
    if (confirm(`¿Eliminar el rol "${role.name}"?`)) {
      this.store.remove(role.id);
    }
  }
}