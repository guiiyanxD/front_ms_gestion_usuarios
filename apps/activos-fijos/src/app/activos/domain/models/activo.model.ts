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
  readonly categoria: string;
  readonly ubicacion: string;
  readonly estado: EstadoActivo;
  readonly marca: string;
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
