import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, of } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { Session } from '../../domain/models/session.model';
import { LoginResponseDto } from '../dto/login-response.dto';
import { toSession } from '../mappers/session.mapper';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      token
      firstName
      lastName
      email
    }
  }
`;

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
  private readonly apollo = inject(Apollo);

  login(credentials: Credentials): Observable<Session> {
    return this.apollo
      .mutate<LoginResponseDto>({
        mutation: LOGIN_MUTATION,
        variables: { email: credentials.email, password: credentials.password },
      })
      .pipe(map(result => toSession(result.data!)));
  }

  logout(): Observable<void> {
    return of(undefined);
  }
}
