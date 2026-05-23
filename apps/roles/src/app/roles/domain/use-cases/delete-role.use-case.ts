import { RoleRepository } from '../repositories/role.repository';
import { Observable } from 'rxjs';

export class DeleteRoleUseCase {
  constructor(private readonly repo: RoleRepository) {}
  execute(id: string): Observable<void> {
    return this.repo.remove(id);
  }
}