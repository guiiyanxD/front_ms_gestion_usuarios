import { AuthUser } from './auth-user.model';

export interface Session {
  readonly accessToken: string;
  readonly expiresAt: number;
  readonly user: AuthUser;
}