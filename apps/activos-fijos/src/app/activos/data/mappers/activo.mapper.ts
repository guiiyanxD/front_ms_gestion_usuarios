import { ActivoDto, CreateActivoDto } from '../dto/activo.dto';
import { Activo, ActivoSummary, CreateActivoInput } from '../../domain/models/activo.model';

export function toActivo(dto: ActivoDto): Activo {
  return {
    id: dto.id,
    codigo: dto.codigo,
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    categoria: dto.categoria,
    ubicacion: dto.ubicacion,
    estado: dto.estado,
    marca: dto.marca,
    modelo: dto.modelo,
    numeroSerie: dto.numero_serie,
    valorAdquisicion: dto.valor_adquisicion,
    fechaAdquisicion: dto.fecha_adquisicion,
    imagenUrl: dto.imagen_url,
    tags: dto.tags ?? [],
  };
}

export function toActivoSummary(dto: ActivoDto): ActivoSummary {
  return {
    id: dto.id,
    codigo: dto.codigo,
    nombre: dto.nombre,
    categoria: dto.categoria,
    ubicacion: dto.ubicacion,
    estado: dto.estado,
    marca: dto.marca,
  };
}

export function toCreateActivoDto(input: CreateActivoInput): CreateActivoDto {
  return {
    codigo: input.codigo,
    nombre: input.nombre,
    descripcion: input.descripcion,
    categoria: input.categoria,
    ubicacion: input.ubicacion,
    estado: input.estado,
    marca: input.marca,
    modelo: input.modelo,
    numero_serie: input.numeroSerie,
    valor_adquisicion: input.valorAdquisicion,
    fecha_adquisicion: input.fechaAdquisicion,
    imagen_url: input.imagenUrl,
    tags: input.tags,
  };
}
