export type ActivoCategory = 'ELECTRONIC_EQUIPMENT' | 'HVAC_EQUIPMENT' | 'FIXTURES' | 'OTHERS';
export type ActivoStatus = 'ACTIVE' | 'IN_STORAGE' | 'UNDER_MAINTENANCE' | 'DAMAGED' | 'RETIRED' | 'LOST';

export interface AssignedUser {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}

export interface Activo {
  readonly id: string;
  readonly codigo: string;
  readonly name: string;
  readonly description: string;
  readonly category: ActivoCategory;
  readonly location: string;
  readonly status: ActivoStatus;
  readonly imageUrl: string;
  readonly acquisitionDate: string;
  readonly areaName: string;
  readonly categoryName: string;
  readonly user: AssignedUser | null;
}

export interface ActivoSummary {
  readonly id: string;
  readonly codigo: string;
  readonly name: string;
  readonly description: string;
  readonly category: ActivoCategory;
  readonly status: ActivoStatus;
  readonly location: string;
  readonly areaId: number;
  readonly areaName: string;
  readonly acquisitionDate: string;
  readonly categoryName: string;
}

export interface PaginatedActivosResult {
  readonly content: ActivoSummary[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalElements: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}

export interface ListActivosFilters {
  readonly offset: number;
  readonly limit: number;
}

export interface CreateActivoInput {
  readonly name: string;
  readonly description: string;
  readonly category: ActivoCategory;
  readonly location: string;
  readonly status: ActivoStatus;
  readonly imageUrl: string;
  readonly acquisitionDate: string;
  readonly userId?: string;
}

export interface UpdateActivoInput {
  readonly name: string;
  readonly description: string;
  readonly category: ActivoCategory;
  readonly location: string;
  readonly status: ActivoStatus;
  readonly imageUrl: string;
  readonly acquisitionDate: string;
}
