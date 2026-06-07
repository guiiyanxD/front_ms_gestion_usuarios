import { Observable, throwError } from 'rxjs';
import { Role, RoleInput } from '../models/role.model';

export class UpdateRoleUseCase {
  execute(_id: string, _input: RoleInput): Observable<Role> {
    return throwError(() => new Error('updateRole is not supported by the API.'));
  }
}
