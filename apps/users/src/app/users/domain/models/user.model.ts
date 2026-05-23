export interface User {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly dni: string;
  readonly email: string;
  readonly username: string;
  readonly roleId: string;     // para preseleccionar en el formulario
  readonly roleName: string;   // para mostrar en la tabla
  readonly createdAt: string;
}

// Datos para crear un usuario (password obligatorio).
export interface CreateUserInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly dni: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly roleId: string;
}

// Datos para actualizar (password opcional: si va vacío, no se cambia).
export interface UpdateUserInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly dni: string;
  readonly email: string;
  readonly username: string;
  readonly password?: string;
  readonly roleId: string;
}

// Opción mínima de rol para el selector.
export interface RoleOption {
  readonly id: string;
  readonly name: string;
}