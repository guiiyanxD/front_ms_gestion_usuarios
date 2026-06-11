import { ActividadDto, PaginatedActividadesDtoResult } from '../dto/actividad.dto';
import { Actividad, PaginatedActividadesResult } from '../../domain/models/actividad.model';

export function toActividad(dto: ActividadDto): Actividad {
  return {
    id: dto.id,
    actionName: dto.actionName,
    description: dto.description,
    createdBy: dto.createdBy,
  };
}

export function toPaginatedActividades(dto: PaginatedActividadesDtoResult): PaginatedActividadesResult {
  return {
    content: dto.content.map(toActividad),
    currentPage: dto.currentPage,
    totalPages: dto.totalPages,
    totalElements: dto.totalElements,
    hasNext: dto.hasNext,
  };
}
