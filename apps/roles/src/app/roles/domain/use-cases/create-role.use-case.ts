import { Role, RoleInput } from '../models/role.model';
import { RoleRepository } from '../repositories/role.repository';
import { Observable } from 'rxjs';

export class CreateRoleUseCase {
  constructor(private readonly repo: RoleRepository) {}
  execute(input: RoleInput): Observable<Role> {
    return this.repo.create(input);
  }
}