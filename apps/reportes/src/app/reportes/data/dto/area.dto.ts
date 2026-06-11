export interface AreaDto {
  id: number;
  codigo: string;
  nombre: string;
}

export interface AreasResponseDto {
  success: boolean;
  data: AreaDto[];
}
