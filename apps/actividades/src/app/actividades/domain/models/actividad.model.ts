export interface Actividad {
  readonly id: string;
  readonly actionName: string;
  readonly description: string;
  readonly createdBy: string;
}

export interface PaginatedActividadesResult {
  readonly content: Actividad[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalElements: number;
  readonly hasNext: boolean;
}

export interface ListActividadesFilters {
  readonly offset: number;
  readonly limit: number;
}
