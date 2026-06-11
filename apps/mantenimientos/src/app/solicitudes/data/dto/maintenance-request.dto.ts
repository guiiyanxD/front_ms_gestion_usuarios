import { MaintenanceRequestStatus, MaintenanceTipo, MaintenancePrioridad } from '../../domain/models/maintenance-request.model';

export interface SolicitudRestDto {
  id: string;
  codigo: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO';
  tipo: MaintenanceTipo;
  prioridad: MaintenancePrioridad;
  descripcion: string;
  fecha_solicitud: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  fecha_estimada_fin: string | null;
  costo: string;
  solicitante_nombre: string;
  tecnico_nombre: string | null;
  activo_codigo: string;
  activo_nombre: string;
  area_nombre: string;
  diagnostico: string | null;
  solucion: string | null;
}

export interface SolicitudesRestMetaDto {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SolicitudesRestResponseDto {
  success: boolean;
  data: SolicitudRestDto[];
  meta: SolicitudesRestMetaDto;
}

export interface SolicitudRestDetailResponseDto {
  success: boolean;
  data: SolicitudRestDto;
}

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
  estado: 'EN_PROCESO' | 'COMPLETADO';
  tecnico_id?: string;
  solucion?: string;
  costo?: number;
}

export interface DiagnosticoRestDto {
  estado: 'EN_PROCESO';
  diagnostico: string;
}
