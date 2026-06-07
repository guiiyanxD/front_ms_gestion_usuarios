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
