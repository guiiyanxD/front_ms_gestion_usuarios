import { Observable } from 'rxjs';
import { UserRepository } from '../repositories/user.repository';

export class DeleteUserUseCase {
  constructor(private readonly repo: UserRepository) {}
  execute(id: string): Observable<void> { return this.repo.remove(id); }
}
