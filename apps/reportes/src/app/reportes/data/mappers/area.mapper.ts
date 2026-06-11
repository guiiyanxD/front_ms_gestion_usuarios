import { AreaDto } from '../dto/area.dto';
import { Area } from '../../domain/models/area.model';

export function toArea(dto: AreaDto): Area {
  return { id: dto.id, codigo: dto.codigo, nombre: dto.nombre };
}
