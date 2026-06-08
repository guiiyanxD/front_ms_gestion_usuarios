import { ActivoCategory, ActivoStatus } from '../../domain/models/activo.model';

export interface CreateActivoRestDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: ActivoCategory;
  ubicacion: string;
  estado: ActivoStatus;
  marca: string;
  modelo: string;
  numero_serie?: string;
  valor_adquisicion?: number;
  fecha_adquisicion: string;
  imagen_url?: string;
  tags?: string[];
}

export interface CreateActivoRestResponseDto {
  asset_id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  estado: string;
  marca: string;
  modelo: string;
  tags: string[];
  imagen_url: string;
}

export interface AssignedUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ActivoDto {
  id: string;
  name: string;
  description: string;
  category: ActivoCategory;
  location: string;
  status: ActivoStatus;
  imageUrl: string;
  acquisitionDate: string;
  user: AssignedUserDto | null;
}

export interface ActivoSummaryDto {
  id: string;
  name: string;
  category: ActivoCategory;
  status: ActivoStatus;
  location: string;
}

export interface PaginatedActivosDtoResult {
  content: ActivoSummaryDto[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
