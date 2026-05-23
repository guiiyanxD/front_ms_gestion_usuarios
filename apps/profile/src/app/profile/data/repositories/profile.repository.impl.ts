import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { Profile } from '../../domain/models/profile.model';
import { ProfileDto } from '../dto/profile.dto';
import { toProfile } from '../mappers/profile.mapper';
import { PROFILE_GATEWAY_URL } from '../../profile.providers';

@Injectable()
export class ProfileRepositoryImpl extends ProfileRepository {
  private readonly http = inject(HttpClient);
  private readonly gateway = inject(PROFILE_GATEWAY_URL);

  // El token JWT lo inyecta el interceptor global del Host automáticamente.
  getProfile(): Observable<Profile> {
    return this.http
      .get<ProfileDto>(`${this.gateway}/auth/profile`)
      .pipe(map(toProfile));
  }
}