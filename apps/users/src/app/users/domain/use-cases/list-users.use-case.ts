import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { Observable } from 'rxjs';

export class ListUsersUseCase {
  constructor(private readonly repo: UserRepository) {}
  execute(): Observable<User[]> { return this.repo.list(); }
}