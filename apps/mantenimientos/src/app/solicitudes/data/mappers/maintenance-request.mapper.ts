import { MaintenanceRequestDto, PaginatedRequestsDtoResult, SolicitudRestDto, SolicitudesRestResponseDto } from '../dto/maintenance-request.dto';
import { MaintenanceRequest, MaintenanceRequestStatus, PaginatedRequestsResult } from '../../domain/models/maintenance-request.model';

const ESTADO_TO_STATUS: Record<SolicitudRestDto['estado'], MaintenanceRequestStatus> = {
  PENDIENTE: 'PENDING',
  EN_PROCESO: 'APPROVED',
  COMPLETADO: 'COMPLETED',
};

export function toMaintenanceRequestFromRest(dto: SolicitudRestDto): MaintenanceRequest {
  return {
    id: dto.id,
    title: dto.codigo,
    description: dto.descripcion,
    status: ESTADO_TO_STATUS[dto.estado] ?? 'PENDING',
    fixedAsset: {
      id: '',
      name: dto.activo_nombre,
      category: '',
      location: dto.area_nombre,
      status: '',
    },
    createdBy: dto.solicitante_nombre,
    createdAt: dto.fecha_solicitud,
    updatedAt: dto.fecha_solicitud,
    statusChangeLog: [],
    codigo: dto.codigo,
    tipo: dto.tipo,
    prioridad: dto.prioridad,
    descripcion: dto.descripcion,
    fechaSolicitud: dto.fecha_solicitud,
    areaNombre: dto.area_nombre,
    activoCodigo: dto.activo_codigo,
    activoNombre: dto.activo_nombre,
    solicitanteNombre: dto.solicitante_nombre,
    tecnicoNombre: dto.tecnico_nombre,
    diagnostico: dto.diagnostico,
    solucion: dto.solucion,
    fechaInicio: dto.fecha_inicio,
    fechaFin: dto.fecha_fin,
    fechaEstimadaFin: dto.fecha_estimada_fin,
    costo: dto.costo,
  };
}

export function toPaginatedRequestsFromRest(res: SolicitudesRestResponseDto): PaginatedRequestsResult {
  return {
    content: res.data.map(toMaintenanceRequestFromRest),
    currentPage: res.meta.page,
    totalPages: res.meta.totalPages,
    totalElements: res.meta.total,
    hasNext: res.meta.page < res.meta.totalPages,
    hasPrevious: res.meta.page > 1,
  };
}

export function toMaintenanceRequest(dto: MaintenanceRequestDto): MaintenanceRequest {
  return {
    id: dto.id,
    title: dto.title ?? '',
    description: dto.description ?? '',
    status: dto.status,
    fixedAsset: {
      id: dto.fixedAsset?.id ?? '',
      name: dto.fixedAsset?.name ?? '',
      category: dto.fixedAsset?.category ?? '',
      location: dto.fixedAsset?.location ?? '',
      status: dto.fixedAsset?.status ?? '',
    },
    createdBy: dto.createdBy ?? '',
    createdAt: dto.createdAt ?? '',
    updatedAt: dto.updatedAt ?? '',
    statusChangeLog: dto.statusChangeLog ?? [],
    codigo: '',
    tipo: 'CORRECTIVO',
    prioridad: 'MEDIA',
    descripcion: dto.description ?? '',
    fechaSolicitud: dto.createdAt ?? '',
    areaNombre: '',
    activoCodigo: '',
    activoNombre: dto.fixedAsset?.name ?? '',
    solicitanteNombre: dto.createdBy ?? '',
    tecnicoNombre: null,
    diagnostico: null,
    solucion: null,
    fechaInicio: null,
    fechaFin: null,
    fechaEstimadaFin: null,
    costo: '0.00',
  };
}

export function toPaginatedRequests(dto: PaginatedRequestsDtoResult): PaginatedRequestsResult {
  return {
    content: dto.content.map(toMaintenanceRequest),
    currentPage: dto.currentPage,
    totalPages: dto.totalPages,
    totalElements: dto.totalElements,
    hasNext: dto.hasNext,
    hasPrevious: dto.hasPrevious,
  };
}
