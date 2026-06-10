export interface User {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly roleId: string;
  readonly roleName: string;
  readonly enabled: boolean;
  readonly createdAt: string;
}

export interface CreateUserInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly roleId: string;
  readonly roleName: string;
}

// updateUser solo acepta firstName y lastName en el API.
export interface UpdateUserInput {
  readonly firstName: string;
  readonly lastName: string;
}

export interface RoleOption {
  readonly id: string;
  readonly name: string;
}
