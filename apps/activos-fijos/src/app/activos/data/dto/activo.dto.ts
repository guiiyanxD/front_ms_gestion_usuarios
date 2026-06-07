import { EstadoActivo } from '../../domain/models/activo.model';

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

export interface SearchActivoRequestDto {
  query: string;
  categoria: string;
  ubicacion: string;
  limit: number;
}

export interface SearchResultItemDto {
  asset_id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  estado: string;
  similarity_score: number;
  imagen_url: string;
}

export interface SearchActivoResponseDto {
  search_type: string;
  query_interpreted: string;
  total_results: number;
  results: SearchResultItemDto[];
  response_time_ms: number;
}
