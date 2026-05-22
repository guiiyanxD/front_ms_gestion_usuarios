// core/auth/data/mappers/session.mapper.ts
import { LoginResponseDto } from '../dto/login-response.dto';
import { Session } from '../../domain/models/session.model';

export function toSession(dto: LoginResponseDto): Session {
  return {
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token,
    expiresAt: Date.now() + dto.expires_in * 1000,
    user: {
      id: dto.user.id,
      username: dto.user.username,
      fullName: dto.user.full_name,
      roles: dto.user.roles ?? [],
      permissions: dto.user.permissions ?? [],
    },
  };
}