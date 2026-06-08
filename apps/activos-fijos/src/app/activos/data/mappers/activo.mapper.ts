import { ActivoDto, ActivoSummaryDto, PaginatedActivosDtoResult } from '../dto/activo.dto';
import { Activo, ActivoSummary, PaginatedActivosResult } from '../../domain/models/activo.model';

export function toActivo(dto: ActivoDto): Activo {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    category: dto.category,
    location: dto.location ?? '',
    status: dto.status,
    imageUrl: dto.imageUrl ?? '',
    acquisitionDate: dto.acquisitionDate ?? '',
    user: dto.user ?? null,
  };
}

export function toActivoSummary(dto: ActivoSummaryDto): ActivoSummary {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    status: dto.status,
    location: dto.location ?? '',
  };
}

export function toPaginatedResult(dto: PaginatedActivosDtoResult): PaginatedActivosResult {
  return {
    content: dto.content.map(toActivoSummary),
    currentPage: dto.currentPage,
    totalPages: dto.totalPages,
    totalElements: dto.totalElements,
    hasNext: dto.hasNext,
    hasPrevious: dto.hasPrevious,
  };
}
