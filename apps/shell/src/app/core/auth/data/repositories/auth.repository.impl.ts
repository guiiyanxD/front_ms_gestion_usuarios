import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { Session } from '../../domain/models/session.model';
import { LoginResponseDto } from '../dto/login-response.dto';
import { toSession } from '../mappers/session.mapper';

const REST_BASE_URL = 'https://ms-bi-automation.onrender.com/api/v1';

interface RestCatalogoUsuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  area_id: number;
}

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
  private readonly http = inject(HttpClient);

  login(credentials: Credentials): Observable<Session> {
    return this.apollo
      .mutate<LoginResponseDto>({
        mutation: LOGIN_MUTATION,
        variables: { email: credentials.email, password: credentials.password },
      })
      .pipe(
        switchMap((result) => {
          const session = toSession(result.data!);
          return this.http
            .get<{ success: boolean; data: RestCatalogoUsuario[] }>(
              `${REST_BASE_URL}/catalogo/usuarios`,
              { headers: { Authorization: `Bearer ${session.accessToken}` } }
            )
            .pipe(
              map((res) => {
                const match = res.data.find((u) => u.email === session.user.username);
                return match ? toSession(result.data!, match.id) : session;
              }),
              catchError(() => of(session))
            );
        })
      );
  }

  logout(): Observable<void> {
    return of(undefined);
  }
}
