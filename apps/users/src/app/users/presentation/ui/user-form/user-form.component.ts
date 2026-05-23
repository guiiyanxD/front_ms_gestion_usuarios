import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, RoleOption, CreateUserInput, UpdateUserInput } from '../../../domain/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  readonly editing = input<User | null>(null);
  readonly roleOptions = input.required<RoleOption[]>();
  readonly saving = input<boolean>(false);
  readonly submitted = output<CreateUserInput | UpdateUserInput>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    dni: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.minLength(6)]],   // validación condicional abajo
    roleId: ['', [Validators.required]],
  });

  readonly isEdit = false;

  constructor() {
    effect(() => {
      const user = this.editing();
      if (user) {
        // Modo edición: rellena todo menos password, que queda vacío (opcional).
        this.form.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          dni: user.dni,
          email: user.email,
          username: user.username,
          password: '',
          roleId: user.roleId,
        });
        // En edición, password no es obligatorio.
        this.form.controls.password.clearValidators();
        this.form.controls.password.addValidators(Validators.minLength(6));
      } else {
        // Modo creación: password obligatorio.
        this.form.reset({ firstName: '', lastName: '', dni: '', email: '', username: '', password: '', roleId: '' });
        this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      }
      this.form.controls.password.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    if (this.editing()) {
      // En edición, si password está vacío, lo omitimos.
      const payload: UpdateUserInput = { ...value };
      if (!value.password) delete (payload as { password?: string }).password;
      this.submitted.emit(payload);
    } else {
      this.submitted.emit(value as CreateUserInput);
    }
  }
}