export interface Role {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdAt: string;
}

export interface RoleInput {
  readonly name: string;
  readonly description: string;
}