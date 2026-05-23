// Refleja la respuesta real del API (camelCase, rol anidado, campos de auditoría).
export interface RoleDto {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  username: string;
  role: RoleDto;            // viene anidado en lectura
  createdAt: string;
  updateAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface PaginatedUsersDto {
  data: UserDto[];
  total: number;
  page: number;
  size: number;
}

// GET /roles también viene paginado (reutilizamos su forma para el selector).
export interface PaginatedRolesDto {
  data: RoleDto[];
  total: number;
  page: number;
  size: number;
}