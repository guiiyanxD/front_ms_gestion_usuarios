import { UserRepository } from '../repositories/user.repository';
import { Observable } from 'rxjs';

export class DeleteUserUseCase {
  constructor(private readonly repo: UserRepository) {}
  execute(id: string): Observable<void> { return this.repo.remove(id); }
}