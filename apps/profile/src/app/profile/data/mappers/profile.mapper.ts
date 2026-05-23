import { ProfileDto } from '../dto/profile.dto';
import { Profile } from '../../domain/models/profile.model';

export function toProfile(dto: ProfileDto): Profile {
  return {
    id: dto.id,
    username: dto.username,
    fullName: dto.full_name,
    email: dto.email,
    roles: dto.roles ?? [],
    permissions: dto.permissions ?? [],
  };
}