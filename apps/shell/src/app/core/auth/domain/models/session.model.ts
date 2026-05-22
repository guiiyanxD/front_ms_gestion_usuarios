import { AuthUser } from './auth-user.model';

export interface Session {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;   // epoch ms
  readonly user: AuthUser;
}