export interface CreateUserRestDto {
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly role: string;
  readonly password: string;
  readonly enabled: boolean;
}

export interface RoleDto {
  id: string;
  name: string;
  description: string;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  role: RoleDto;
  createdAt: string;
}
