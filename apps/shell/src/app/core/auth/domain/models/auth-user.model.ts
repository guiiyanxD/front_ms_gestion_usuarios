export interface AuthUser {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly roles: ReadonlyArray<string>;
  readonly permissions: ReadonlyArray<string>;
  readonly restUserId: string | null;
}