import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { Observable, forkJoin, map } from 'rxjs';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User, CreateUserInput, UpdateUserInput, RoleOption } from '../../domain/models/user.model';
import { UserDto, RoleDto, CreateUserRestDto } from '../dto/user.dto';
import { toUser, toRoleOption } from '../mappers/user.mapper';

const REST_BASE_URL = 'https://ms-bi-automation.onrender.com/api/v1';

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
    $roleId: ID!
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
  mutation UpdateUser($id: ID!, $firstName: String!, $lastName: String!) {
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

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
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
  private readonly http   = inject(HttpClient);

  list(): Observable<User[]> {
    return this.apollo
      .query<{ getAllUsers: UserDto[] }>({
        query: GET_ALL_USERS,
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => result.data!.getAllUsers.map(toUser)));
  }

  create(input: CreateUserInput): Observable<User> {
    const graphql$ = this.apollo
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

    const restDto: CreateUserRestDto = {
      email: input.email,
      firstname: input.firstName,
      lastname: input.lastName,
      role: input.roleName,
      password: input.password,
      enabled: true,
    };
    const rest$ = this.http.post(`${REST_BASE_URL}/usuarios`, restDto);

    return forkJoin([graphql$, rest$]).pipe(map(([user]) => user));
  }

  update(id: string, input: UpdateUserInput): Observable<User> {
    return this.apollo
      .mutate<{ updateUser: UserDto }>({
        mutation: UPDATE_USER,
        variables: { id, firstName: input.firstName, lastName: input.lastName },
      })
      .pipe(map((result) => toUser(result.data!.updateUser)));
  }

  remove(id: string): Observable<void> {
    return this.apollo
      .mutate({ mutation: DELETE_USER, variables: { id } })
      .pipe(map(() => undefined));
  }

  listRoles(): Observable<RoleOption[]> {
    return this.apollo
      .query<{ getAllRoles: RoleDto[] }>({
        query: GET_ALL_ROLES,
        fetchPolicy: 'cache-first',
      })
      .pipe(map((result) => result.data!.getAllRoles.map(toRoleOption)));
  }
}
