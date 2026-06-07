import { Role, RoleInput } from '../models/role.model';
import { Observable } from 'rxjs';

export abstract class RoleRepository {
  abstract list(): Observable<Role[]>;
  abstract create(input: RoleInput): Observable<Role>;
  abstract remove(id: string): Observable<void>;
}