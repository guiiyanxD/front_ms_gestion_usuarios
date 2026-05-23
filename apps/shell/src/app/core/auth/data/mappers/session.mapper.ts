import { LoginResponseDto } from '../dto/login-response.dto';
import { Session } from '../../domain/models/session.model';

export function toSession(dto: LoginResponseDto): Session {
  return {
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    expiresAt: 0, // tu API no envía expiración; lo derivaremos del JWT más adelante
    user: {
      id: dto.user.id,
      username: dto.user.username,
      fullName: dto.user.username,        // no hay fullName; usamos username por ahora
      roles: [dto.user.role],             // un solo rol → lo metemos en el array
      permissions: [],                    // tu API no envía permisos aún
    },
  };
}