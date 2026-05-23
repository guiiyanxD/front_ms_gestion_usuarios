import { User, UpdateUserInput } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { Observable } from 'rxjs';

export class UpdateUserUseCase {
  constructor(private readonly repo: UserRepository) {}
  execute(id: string, input: UpdateUserInput): Observable<User> { return this.repo.update(id, input); }
}