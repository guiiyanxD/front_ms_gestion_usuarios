import { MaintenanceRequestStatus, MaintenanceTipo, MaintenancePrioridad } from '../../domain/models/maintenance-request.model';

export interface FixedAssetRefDto {
  id: string;
  name: string;
  category: string;
  location: string;
  status: string;
}

export interface StatusChangeLogDto {
  fromStatus: string;
  toStatus: string;
}

export interface MaintenanceRequestDto {
  id: string;
  title: string;
  description: string;
  status: MaintenanceRequestStatus;
  fixedAsset: FixedAssetRefDto;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  statusChangeLog: StatusChangeLogDto[];
}

export interface PaginatedRequestsDtoResult {
  content: MaintenanceRequestDto[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CreateMaintenanceRequestRestDto {
  solicitante_id: string;
  activo_id: string;
  area_id: number;
  tipo: MaintenanceTipo;
  prioridad: MaintenancePrioridad;
  descripcion: string;
  canal_origen: 'WEB';
  metadata: Record<string, unknown>;
}

export interface UpdateStatusRestDto {
  estado: 'EN_PROCESO' | 'COMPLETADO' | 'RECHAZADO';
  tecnico_id?: string;
  diagnostico?: string;
  solucion?: string;
  costo?: number;
}
