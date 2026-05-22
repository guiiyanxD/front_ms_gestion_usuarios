// core/auth/domain/use-cases/login.use-case.ts
import { Credentials } from '../models/credentials.model';
import { Session } from '../models/session.model';
import { AuthRepository } from '../repositories/auth.repository';
import { Observable } from 'rxjs';

export class LoginUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(credentials: Credentials): Observable<Session> {
    // Punto único para reglas de negocio de login (validaciones, política de intentos, etc.)
    return this.repo.login(credentials);
  }
}