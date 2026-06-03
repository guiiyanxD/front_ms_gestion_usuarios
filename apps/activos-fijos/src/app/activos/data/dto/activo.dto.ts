import { EstadoActivo } from '../../domain/models/activo.model';

// Refleja la forma real del API (snake_case, a diferencia del resto del proyecto).
export interface ActivoDto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  estado: EstadoActivo;
  marca: string;
  modelo: string;
  numero_serie: string;
  valor_adquisicion: number;
  fecha_adquisicion: string;
  imagen_url: string;
  tags: string[];
}

export interface PaginatedActivosDto {
  data: ActivoDto[];
  total: number;
  page: number;
  size: number;
}

// Body para POST /api/v1/assets (misma forma que el DTO de respuesta salvo `id`).
export interface CreateActivoDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  estado: EstadoActivo;
  marca: string;
  modelo: string;
  numero_serie: string;
  valor_adquisicion: number;
  fecha_adquisicion: string;
  imagen_url: string;
  tags: string[];
}
