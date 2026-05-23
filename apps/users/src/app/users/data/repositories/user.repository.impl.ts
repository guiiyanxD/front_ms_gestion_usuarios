import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User, CreateUserInput, UpdateUserInput, RoleOption } from '../../domain/models/user.model';
import { UserDto, PaginatedUsersDto, PaginatedRolesDto } from '../dto/user.dto';
import { toUser, toRoleOption } from '../mappers/user.mapper';
import { USERS_GATEWAY_URL } from '../../users.providers';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  private readonly http = inject(HttpClient);
  private readonly gateway = inject(USERS_GATEWAY_URL);

  list(): Observable<User[]> {
    return this.http
      .get<PaginatedUsersDto>(`${this.gateway}/users`)
      .pipe(map((res) => res.data.map(toUser)));
  }

  create(input: CreateUserInput): Observable<User> {
    return this.http
      .post<UserDto>(`${this.gateway}/users`, input)
      .pipe(map(toUser));
  }

  update(id: string, input: UpdateUserInput): Observable<User> {
    // Si password viene vacío o ausente, no lo enviamos (no se cambia).
    const body: Record<string, unknown> = { ...input };
    if (!input.password) delete body['password'];
    return this.http
      .patch<UserDto>(`${this.gateway}/users/${id}`, body)
      .pipe(map(toUser));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.gateway}/users/${id}`);
  }

  listRoles(): Observable<RoleOption[]> {
    return this.http
      .get<PaginatedRolesDto>(`${this.gateway}/roles`)
      .pipe(map((res) => res.data.map(toRoleOption)));
  }
}   