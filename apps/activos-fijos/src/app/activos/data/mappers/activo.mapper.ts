import { ActivoDto, ActivoRestListDto, ActivoSummaryDto, PaginatedActivosDtoResult } from '../dto/activo.dto';
import { Activo, ActivoSummary, PaginatedActivosResult } from '../../domain/models/activo.model';

export function toActivo(dto: ActivoDto): Activo {
  return {
    id: dto.id,
    graphqlId: dto.id,
    codigo: '',
    name: dto.name,
    description: dto.description ?? '',
    category: dto.category,
    location: dto.location ?? '',
    status: dto.status,
    imageUrl: dto.imageUrl ?? '',
    acquisitionDate: dto.acquisitionDate ?? '',
    areaName: '',
    categoryName: '',
    user: dto.user ?? null,
  };
}

export function toActivoSummary(dto: ActivoSummaryDto): ActivoSummary {
  return {
    id: dto.id,
    codigo: '',
    name: dto.name,
    description: '',
    category: dto.category,
    status: dto.status,
    location: dto.location ?? '',
    areaId: 0,
    areaName: '',
    acquisitionDate: '',
    categoryName: '',
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

export function toActivoSummaryFromRest(dto: ActivoRestListDto): ActivoSummary {
  return {
    id: dto.id,
    codigo: dto.codigo ?? '',
    name: dto.name,
    description: dto.description ?? '',
    category: dto.category,
    status: dto.status,
    location: dto.location ?? '',
    areaId: dto.areaId ?? 0,
    areaName: dto.areaName ?? '',
    acquisitionDate: dto.acquisitionDate ?? '',
    categoryName: dto.categoryName ?? '',
  };
}

export function toActivoFromRest(dto: ActivoRestListDto, graphqlId = ''): Activo {
  return {
    id: dto.id,
    graphqlId,
    codigo: dto.codigo ?? '',
    name: dto.name,
    description: dto.description ?? '',
    category: dto.category,
    location: dto.location ?? '',
    status: dto.status,
    imageUrl: '',
    acquisitionDate: dto.acquisitionDate ?? '',
    areaName: dto.areaName ?? '',
    categoryName: dto.categoryName ?? '',
    user: null,
  };
}

export function toPaginatedResultFromRestList(items: ActivoRestListDto[]): PaginatedActivosResult {
  return {
    content: items.map(toActivoSummaryFromRest),
    currentPage: 1,
    totalPages: 1,
    totalElements: items.length,
    hasNext: false,
    hasPrevious: false,
  };
}
