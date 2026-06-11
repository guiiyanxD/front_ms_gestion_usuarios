export type MaintenanceRequestStatus = 'PENDING' | 'APPROVED' | 'COMPLETED';
export type MaintenanceTipo = 'CORRECTIVO' | 'PREVENTIVO';
export type MaintenancePrioridad = 'ALTA' | 'MEDIA' | 'BAJA' | 'CRITICA';

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
  // campos REST
  readonly codigo: string;
  readonly tipo: MaintenanceTipo;
  readonly prioridad: MaintenancePrioridad;
  readonly descripcion: string;
  readonly fechaSolicitud: string;
  readonly areaNombre: string;
  readonly activoCodigo: string;
  readonly activoNombre: string;
  readonly solicitanteNombre: string;
  // campos de ciclo de vida (nullable)
  readonly tecnicoNombre: string | null;
  readonly diagnostico: string | null;
  readonly solucion: string | null;
  readonly fechaInicio: string | null;
  readonly fechaFin: string | null;
  readonly fechaEstimadaFin: string | null;
  readonly costo: string;
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
  readonly codigo?: string;
  readonly prioridad?: MaintenancePrioridad;
  readonly status?: MaintenanceRequestStatus;
}

export interface CreateMaintenanceRequestInput {
  readonly fixedAssetId: string;
  readonly description: string;
  readonly tipo: MaintenanceTipo;
  readonly prioridad: MaintenancePrioridad;
  readonly areaId: number;
}

export type UpdateStatusInput =
  | { readonly newStatus: 'APPROVED'; readonly technicianId: string }
  | { readonly newStatus: 'COMPLETED'; readonly solucion: string; readonly costo: number };
