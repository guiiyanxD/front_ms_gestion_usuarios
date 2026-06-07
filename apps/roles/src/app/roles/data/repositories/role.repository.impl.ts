import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { Role, RoleInput } from '../../domain/models/role.model';
import { RoleDto } from '../dto/role.dto';
import { toRole } from '../mappers/role.mapper';

const GET_ALL_ROLES = gql`
  query GetAllRoles {
    getAllRoles {
      id
      name
      description
      createdAt
    }
  }
`;

const CREATE_ROLE = gql`
  mutation CreateRole($name: String!, $description: String!) {
    createRole(name: $name, description: $description) {
      id
      name
      description
      createdAt
    }
  }
`;

const DELETE_ROLE = gql`
  mutation DeleteRole($id: String!) {
    deleteRole(id: $id)
  }
`;

@Injectable()
export class RoleRepositoryImpl extends RoleRepository {
  private readonly apollo = inject(Apollo);

  list(): Observable<Role[]> {
    return this.apollo
      .query<{ getAllRoles: RoleDto[] }>({
        query: GET_ALL_ROLES,
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => result.data!.getAllRoles.map(toRole)));
  }

  create(input: RoleInput): Observable<Role> {
    return this.apollo
      .mutate<{ createRole: RoleDto }>({
        mutation: CREATE_ROLE,
        variables: { name: input.name, description: input.description },
      })
      .pipe(map((result) => toRole(result.data!.createRole)));
  }

  remove(id: string): Observable<void> {
    return this.apollo
      .mutate({ mutation: DELETE_ROLE, variables: { id } })
      .pipe(map(() => undefined));
  }
}
