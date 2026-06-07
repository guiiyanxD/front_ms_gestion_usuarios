export interface LoginResponseDto {
  login: {
    id: string;
    token: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}