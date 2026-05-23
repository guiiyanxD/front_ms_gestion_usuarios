import { ProfileDto } from '../dto/profile.dto';
import { Profile } from '../../domain/models/profile.model';

export function toProfile(dto: ProfileDto): Profile {
  return {
    id: dto.id,
    username: dto.username,
    fullName: dto.username,     // no hay fullName; usamos username
    email: '—',                 // tu API no envía email aún
    roles: [dto.role],          // un solo rol → al array
    permissions: [],
  };
}