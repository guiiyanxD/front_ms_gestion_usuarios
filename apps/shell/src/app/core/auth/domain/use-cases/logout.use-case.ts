// core/auth/domain/use-cases/logout.use-case.ts
import { AuthRepository } from '../repositories/auth.repository';
import { Observable } from 'rxjs';

export class LogoutUseCase {
  constructor(private readonly repo: AuthRepository) {}

  execute(): Observable<void> {
    return this.repo.logout();
  }
}