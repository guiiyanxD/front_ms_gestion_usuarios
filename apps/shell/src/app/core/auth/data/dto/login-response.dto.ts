// core/auth/data/dto/login-response.dto.ts
// Refleja el contrato del API Gateway, no el del dominio.
export interface LoginResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;          // segundos
  user: {
    id: string;
    username: string;
    full_name: string;
    roles: string[];
    permissions: string[];
  };
}