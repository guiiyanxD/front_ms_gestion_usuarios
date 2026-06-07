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
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roleId: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const user = this.editing();
      if (user) {
        this.form.reset({ firstName: user.firstName, lastName: user.lastName, email: '', password: '', roleId: '' });
        this.form.controls.email.clearValidators();
        this.form.controls.password.clearValidators();
        this.form.controls.roleId.clearValidators();
      } else {
        this.form.reset({ firstName: '', lastName: '', email: '', password: '', roleId: '' });
        this.form.controls.email.setValidators([Validators.required, Validators.email]);
        this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
        this.form.controls.roleId.setValidators([Validators.required]);
      }
      this.form.controls.email.updateValueAndValidity();
      this.form.controls.password.updateValueAndValidity();
      this.form.controls.roleId.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { firstName, lastName, email, password, roleId } = this.form.getRawValue();
    if (this.editing()) {
      this.submitted.emit({ firstName, lastName });
    } else {
      this.submitted.emit({ firstName, lastName, email, password, roleId });
    }
  }
}
