import { ProfileDto } from '../dto/profile.dto';
import { Profile } from '../../domain/models/profile.model';

export function toProfile(dto: ProfileDto): Profile {
  return {
    id: dto.id,
    username: dto.email,
    fullName: `${dto.firstName} ${dto.lastName}`,
    email: dto.email,
    roles: [dto.role.name],
    permissions: [],
    enabled: dto.enabled,
  };
}