export interface Role {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
}

// Datos para crear o actualizar un rol (el dominio no conoce la forma del API).
export interface RoleInput {
  readonly name: string;
}