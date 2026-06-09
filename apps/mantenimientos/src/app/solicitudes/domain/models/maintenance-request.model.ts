export type MaintenanceRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type MaintenanceTipo = 'CORRECTIVO' | 'PREVENTIVO';
export type MaintenancePrioridad = 'ALTA' | 'MEDIA' | 'BAJA';

export interface FixedAssetRef {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly location: string;
  readonly status: string;
}

export interface StatusChangeLog {
  readonly fromStatus: string;
  readonly toStatus: string;
}

export interface MaintenanceRequest {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: MaintenanceRequestStatus;
  readonly fixedAsset: FixedAssetRef;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly statusChangeLog: StatusChangeLog[];
}

export interface PaginatedRequestsResult {
  readonly content: MaintenanceRequest[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalElements: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}

export interface ListRequestsFilters {
  readonly offset: number;
  readonly limit: number;
}

export interface CreateMaintenanceRequestInput {
  readonly fixedAssetId: string;
  readonly title: string;
  readonly description: string;
  readonly tipo: MaintenanceTipo;
  readonly prioridad: MaintenancePrioridad;
  readonly areaId: number;
}

export type UpdateStatusInput =
  | { readonly newStatus: 'APPROVED'; readonly technicianId: string; readonly diagnostico: string }
  | { readonly newStatus: 'COMPLETED'; readonly solucion: string; readonly costo: number }
  | { readonly newStatus: 'REJECTED'; readonly diagnostico: string };
