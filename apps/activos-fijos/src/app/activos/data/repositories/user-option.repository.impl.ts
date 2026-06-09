import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { UserOptionRepository } from '../../domain/repositories/user-option.repository';
import { UserOption } from '../../domain/models/user-option.model';

const GET_ALL_USERS = gql`
  query GetAllUsersForSelector {
    getAllUsers {
      id
      firstName
      lastName
      email
    }
  }
`;

@Injectable()
export class UserOptionRepositoryImpl extends UserOptionRepository {
  private readonly apollo = inject(Apollo);

  list(): Observable<UserOption[]> {
    return this.apollo
      .query<{ getAllUsers: UserOption[] }>({
        query: GET_ALL_USERS,
        fetchPolicy: 'cache-first',
      })
      .pipe(map((result) => result.data!.getAllUsers));
  }
}
