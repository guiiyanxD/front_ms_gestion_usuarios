// features/login/login.page.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoginFormComponent } from './ui/login-form/login-form.component';
import { AuthStore } from '../../core/auth/state/auth.store';
import { Credentials } from '../../core/auth/domain/models/credentials.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private readonly store = inject(AuthStore);

  readonly loading = this.store.status; // 'loading' | ...
  readonly error = this.store.error;

  onSubmit(credentials: Credentials): void {
    this.store.login(credentials);
  }
}