export interface Disponibilidad {
  readonly totalActivos: number;
  readonly activosOperativos: number;
  readonly activosEnMantenimiento: number;
  readonly activosFueraServicio: number;
  readonly activosBaja: number;
  readonly tasaDisponibilidadPct: number;
}

export interface Mttr {
  readonly solicitudesCompletadas: number;
  readonly mttrHoras: number;
  readonly mttrDias: number;
}

export interface Mtbf {
  readonly mtbfDias: number;
  readonly numObservaciones: number;
}

export interface TopCostoItem {
  readonly activoId: string;
  readonly codigo: string;
  readonly activoNombre: string;
  readonly areaNombre: string;
  readonly numMantenimientos: number;
  readonly costoTotal: number;
  readonly costoPromedio: number;
}

export interface CumplimientoItem {
  readonly periodo: string;
  readonly preventivosTotal: number;
  readonly preventivosCompletados: number;
  readonly cumplimientoPct: number;
}

export interface Dashboard {
  readonly disponibilidad: Disponibilidad;
  readonly mttr: Mttr;
  readonly mtbf: Mtbf;
  readonly topCostosMantenimiento: TopCostoItem[];
  readonly cumplimientoPreventivo: CumplimientoItem[];
  readonly generadoEn: string;
}
