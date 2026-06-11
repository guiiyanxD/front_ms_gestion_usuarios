import { ActivoCategory, ActivoStatus } from '../../domain/models/activo.model';

export interface ActivoRestListDto {
  id: string;
  codigo: string;
  name: string;
  description: string;
  acquisitionDate: string;
  location: string;
  category: ActivoCategory;
  status: ActivoStatus;
  areaId: number;
  areaName: string;
  categoryId: number;
  categoryName: string;
  created_at: string;
  updated_at: string;
}

export interface ActivoRestListResponseDto {
  success: boolean;
  data: ActivoRestListDto[];
}

export interface CreateActivoRestDto {
  name: string;
  description: string;
  acquisitionDate: string;
  category: ActivoCategory;
  location: string;
  status: ActivoStatus;
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
