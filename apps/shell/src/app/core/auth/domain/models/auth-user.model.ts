export interface AuthUser {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly roles: ReadonlyArray<string>;     // base del menú dinámico por rol
  readonly permissions: ReadonlyArray<string>;
}