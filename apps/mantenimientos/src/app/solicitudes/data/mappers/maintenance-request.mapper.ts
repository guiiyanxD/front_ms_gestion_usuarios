import { MaintenanceRequestDto, PaginatedRequestsDtoResult } from '../dto/maintenance-request.dto';
import { MaintenanceRequest, PaginatedRequestsResult } from '../../domain/models/maintenance-request.model';

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
