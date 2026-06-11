export interface Reporte {
  readonly id: string;
  readonly endpoint: string;
  readonly label: string;
  readonly descripcion: string;
}

export type DownloadFormato = 'excel' | 'pdf';

export interface DownloadFilters {
  readonly areaId?: number;
  readonly fechaInicio?: string;
  readonly fechaFin?: string;
}
