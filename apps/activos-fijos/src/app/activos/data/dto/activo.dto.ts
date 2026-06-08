import { ActivoCategory, ActivoStatus } from '../../domain/models/activo.model';

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
