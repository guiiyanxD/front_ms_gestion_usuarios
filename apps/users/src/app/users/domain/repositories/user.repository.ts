import { User, CreateUserInput, UpdateUserInput, RoleOption } from '../models/user.model';
import { Observable } from 'rxjs';

export abstract class UserRepository {
  abstract list(): Observable<User[]>;
  abstract create(input: CreateUserInput): Observable<User>;
  abstract update(id: string, input: UpdateUserInput): Observable<User>;
  abstract listRoles(): Observable<RoleOption[]>;
}