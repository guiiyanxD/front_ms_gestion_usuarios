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

// La respuesta del listado viene paginada.
export interface PaginatedRolesDto {
  data: RoleDto[];
  total: number;
  page: number;
  size: number;
}