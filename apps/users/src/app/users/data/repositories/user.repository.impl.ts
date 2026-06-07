import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User, CreateUserInput, UpdateUserInput, RoleOption } from '../../domain/models/user.model';
import { UserDto, RoleDto } from '../dto/user.dto';
import { toUser, toRoleOption } from '../mappers/user.mapper';

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      firstName
      lastName
      email
      enabled
      createdAt
      role { id  name  description }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser(
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $roleId: String!
  ) {
    createUser(
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      roleId: $roleId
    ) {
      id
      firstName
      lastName
      email
      enabled
      createdAt
      role { id  name  description }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $firstName: String!, $lastName: String!) {
    updateUser(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
      email
      enabled
      createdAt
      role { id  name  description }
    }
  }
`;

const GET_ALL_ROLES = gql`
  query GetAllRolesForSelector {
    getAllRoles {
      id
      name
      description
    }
  }
`;

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  private readonly apollo = inject(Apollo);

  list(): Observable<User[]> {
    return this.apollo
      .query<{ getAllUsers: UserDto[] }>({
        query: GET_ALL_USERS,
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => result.data.getAllUsers.map(toUser)));
  }

  create(input: CreateUserInput): Observable<User> {
    return this.apollo
      .mutate<{ createUser: UserDto }>({
        mutation: CREATE_USER,
        variables: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          password: input.password,
          roleId: input.roleId,
        },
      })
      .pipe(map((result) => toUser(result.data!.createUser)));
  }

  update(id: string, input: UpdateUserInput): Observable<User> {
    return this.apollo
      .mutate<{ updateUser: UserDto }>({
        mutation: UPDATE_USER,
        variables: { id, firstName: input.firstName, lastName: input.lastName },
      })
      .pipe(map((result) => toUser(result.data!.updateUser)));
  }

  listRoles(): Observable<RoleOption[]> {
    return this.apollo
      .query<{ getAllRoles: RoleDto[] }>({
        query: GET_ALL_ROLES,
        fetchPolicy: 'cache-first',
      })
      .pipe(map((result) => result.data.getAllRoles.map(toRoleOption)));
  }
}
