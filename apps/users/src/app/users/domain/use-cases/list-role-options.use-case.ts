import { RoleOption } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { Observable } from 'rxjs';

export class ListRoleOptionsUseCase {
  constructor(private readonly repo: UserRepository) {}
  execute(): Observable<RoleOption[]> { return this.repo.listRoles(); }
}