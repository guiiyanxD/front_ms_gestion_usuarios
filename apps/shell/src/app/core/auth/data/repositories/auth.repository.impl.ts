// core/auth/data/repositories/auth.repository.impl.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { Credentials } from '../../domain/models/credentials.model';
import { Session } from '../../domain/models/session.model';
import { LoginResponseDto } from '../dto/login-response.dto';
import { toSession } from '../mappers/session.mapper';
import { API_GATEWAY_URL } from '../../auth.providers';

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly gateway = inject(API_GATEWAY_URL);

  // Única clase que conoce las rutas del Gateway. Nunca un microservicio directo.
  login(credentials: Credentials): Observable<Session> {
    return this.http
      .post<LoginResponseDto>(`${this.gateway}/auth/login`, credentials)
      .pipe(map(toSession));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.gateway}/auth/logout`, {});
  }
}