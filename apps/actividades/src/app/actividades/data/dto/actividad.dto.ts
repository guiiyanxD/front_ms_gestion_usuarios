export interface ActividadDto {
  id: string;
  actionName: string;
  description: string;
  createdBy: string;
}

export interface PaginatedActividadesDtoResult {
  content: ActividadDto[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface GetAllActivitiesResponseDto {
  data: {
    getAllActivities: PaginatedActividadesDtoResult;
  };
}
