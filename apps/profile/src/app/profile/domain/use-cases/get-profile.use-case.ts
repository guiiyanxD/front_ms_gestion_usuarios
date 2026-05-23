import { Profile } from '../models/profile.model';
import { ProfileRepository } from '../repositories/profile.repository';
import { Observable } from 'rxjs';

export class GetProfileUseCase {
  constructor(private readonly repo: ProfileRepository) {}

  execute(): Observable<Profile> {
    return this.repo.getProfile();
  }
}