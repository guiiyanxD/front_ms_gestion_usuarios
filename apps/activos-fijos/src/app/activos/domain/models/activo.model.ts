export type EstadoActivo = 'activo' | 'inactivo' | 'en_mantenimiento' | 'dado_de_baja';

export interface Activo {
  readonly id: string;
  readonly codigo: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly categoria: string;
  readonly ubicacion: string;
  readonly estado: EstadoActivo;
  readonly marca: string;
  readonly modelo: string;
  readonly numeroSerie: string;
  readonly valorAdquisicion: number;
  readonly fechaAdquisicion: string;
  readonly imagenUrl: string;
  readonly tags: string[];
}

export interface ActivoSummary {
  readonly id: string;
  readonly codigo: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly categoria: string;
  readonly ubicacion: string;
  readonly estado: EstadoActivo;
  readonly imagenUrl: string;
}

export interface SearchActivoFilters {
  readonly query: string;
  readonly categoria: string;
  readonly ubicacion: string;
  readonly limit: number;
}

export interface SearchActivoResult {
  readonly items: ActivoSummary[];
  readonly total: number;
  readonly queryInterpreted: string;
}

export interface CreateActivoInput {
  readonly codigo: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly categoria: string;
  readonly ubicacion: string;
  readonly estado: EstadoActivo;
  readonly marca: string;
  readonly modelo: string;
  readonly numeroSerie: string;
  readonly valorAdquisicion: number;
  readonly fechaAdquisicion: string;
  readonly imagenUrl: string;
  readonly tags: string[];
}
