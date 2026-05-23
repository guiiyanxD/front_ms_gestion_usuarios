import { Role, RoleInput } from '../models/role.model';
import { RoleRepository } from '../repositories/role.repository';
import { Observable } from 'rxjs';

export class UpdateRoleUseCase {
  constructor(private readonly repo: RoleRepository) {}
  execute(id: string, input: RoleInput): Observable<Role> {
    return this.repo.update(id, input);
  }
}