// Refleja el contrato del Gateway (snake_case). Ajusta si tu API difiere.
export interface ProfileDto {
  id: string;
  username: string;
  full_name: string;
  email: string;
  roles: string[];
  permissions: string[];
}