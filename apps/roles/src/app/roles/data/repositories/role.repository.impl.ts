import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { Role, RoleInput } from '../../domain/models/role.model';
import { RoleDto, PaginatedRolesDto } from '../dto/role.dto';
import { toRole } from '../mappers/role.mapper';
import { ROLES_GATEWAY_URL } from '../../roles.providers';

@Injectable()
export class RoleRepositoryImpl extends RoleRepository {
  private readonly http = inject(HttpClient);
  private readonly gateway = inject(ROLES_GATEWAY_URL);

  list(): Observable<Role[]> {
    return this.http
      .get<PaginatedRolesDto>(`${this.gateway}/roles`)
      .pipe(map((res) => res.data.map(toRole)));
  }

  create(input: RoleInput): Observable<Role> {
    return this.http
      .post<RoleDto>(`${this.gateway}/roles`, input)
      .pipe(map(toRole));
  }

  update(id: string, input: RoleInput): Observable<Role> {
    return this.http
      .patch<RoleDto>(`${this.gateway}/roles/${id}`, input)
      .pipe(map(toRole));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.gateway}/roles/${id}`);
  }
}