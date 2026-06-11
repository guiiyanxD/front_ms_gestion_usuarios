import { LoginResponseDto } from '../dto/login-response.dto';
import { Session } from '../../domain/models/session.model';

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

function decodeJwt(token: string): JwtPayload {
  return JSON.parse(atob(token.split('.')[1]));
}

export function toSession(dto: LoginResponseDto, restUserId: string | null = null): Session {
  const { id, token, firstName, lastName, email } = dto.login;
  const { role, exp } = decodeJwt(token);
  return {
    accessToken: token,
    expiresAt: exp * 1000,
    user: {
      id,
      username: email,
      fullName: `${firstName} ${lastName}`,
      roles: [role],
      permissions: [],
      restUserId,
    },
  };
}
