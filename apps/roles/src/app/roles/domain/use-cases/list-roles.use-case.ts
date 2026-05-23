import { Role } from '../models/role.model';
import { RoleRepository } from '../repositories/role.repository';
import { Observable } from 'rxjs';

export class ListRolesUseCase {
  constructor(private readonly repo: RoleRepository) {}
  execute(): Observable<Role[]> {
    return this.repo.list();
  }
}