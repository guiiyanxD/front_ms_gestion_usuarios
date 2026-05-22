// core/auth/domain/repositories/auth.repository.ts
import { Credentials } from '../models/credentials.model';
import { Session } from '../models/session.model';
import { Observable } from 'rxjs';

/**
 * Contrato del dominio. Cero dependencias de framework ni de HttpClient.
 * La capa Data provee la implementación concreta vía DI.
 */
export abstract class AuthRepository {
  abstract login(credentials: Credentials): Observable<Session>;
  abstract logout(): Observable<void>;
}