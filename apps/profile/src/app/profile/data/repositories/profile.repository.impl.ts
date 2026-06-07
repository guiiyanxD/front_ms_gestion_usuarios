import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { Profile } from '../../domain/models/profile.model';
import { ProfileDto } from '../dto/profile.dto';
import { toProfile } from '../mappers/profile.mapper';

const GET_USER_BY_ID = gql`
  query GetUserById($id: String!) {
    userById(id: $id) {
      id
      firstName
      lastName
      email
      role {
        id
        name
      }
      enabled
    }
  }
`;

@Injectable()
export class ProfileRepositoryImpl extends ProfileRepository {
  private readonly apollo = inject(Apollo);

  getProfile(id: string): Observable<Profile> {
    return this.apollo
      .query<{ userById: ProfileDto }>({
        query: GET_USER_BY_ID,
        variables: { id },
      })
      .pipe(map((result) => toProfile(result.data.userById)));
  }
}
