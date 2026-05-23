import { User, CreateUserInput } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { Observable } from 'rxjs';

export class CreateUserUseCase {
  constructor(private readonly repo: UserRepository) {}
  execute(input: CreateUserInput): Observable<User> { return this.repo.create(input); }
}