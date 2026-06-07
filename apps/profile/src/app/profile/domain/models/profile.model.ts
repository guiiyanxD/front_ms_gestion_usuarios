export interface Profile {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly email: string;
  readonly roles: ReadonlyArray<string>;
  readonly permissions: ReadonlyArray<string>;
  readonly enabled: boolean;
}