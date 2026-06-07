import { Profile } from '../models/profile.model';
import { Observable } from 'rxjs';

/**
 * Contrato del dominio. Cero dependencias de Angular core ni de HttpClient.
 */
export abstract class ProfileRepository {
  abstract getProfile(id: string): Observable<Profile>;
}