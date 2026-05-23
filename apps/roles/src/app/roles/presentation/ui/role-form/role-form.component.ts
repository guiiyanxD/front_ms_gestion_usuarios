import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, RoleInput } from '../../../domain/models/role.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css',
})
export class RoleFormComponent {
  readonly editing = input<Role | null>(null);
  readonly saving = input<boolean>(false);
  readonly submitted = output<RoleInput>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor() {
    // Rellena el formulario cuando se edita un rol existente.
    effect(() => {
      const role = this.editing();
      this.form.reset({ name: role?.name ?? '' });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitted.emit(this.form.getRawValue());
  }
}