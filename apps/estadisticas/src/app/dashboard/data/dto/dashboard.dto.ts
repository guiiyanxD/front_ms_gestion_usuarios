export interface DisponibilidadDto {
  readonly total_activos: string;
  readonly activos_operativos: string;
  readonly activos_en_mantenimiento: string;
  readonly activos_fuera_servicio: string;
  readonly activos_baja: string;
  readonly tasa_disponibilidad_pct: string;
}

export interface MttrDto {
  readonly solicitudes_completadas: string;
  readonly mttr_horas: string;
  readonly mttr_dias: string;
}

export interface MtbfDto {
  readonly mtbf_dias: string;
  readonly num_observaciones: string;
}

export interface TopCostoItemDto {
  readonly activo_id: string;
  readonly codigo: string;
  readonly activo_nombre: string;
  readonly area_nombre: string;
  readonly num_mantenimientos: string;
  readonly costo_total: string;
  readonly costo_promedio: string;
}

export interface CumplimientoItemDto {
  readonly periodo: string;
  readonly preventivos_total: string;
  readonly preventivos_completados: string;
  readonly cumplimiento_pct: string;
}

export interface DashboardDto {
  readonly disponibilidad: DisponibilidadDto;
  readonly mttr: MttrDto;
  readonly mtbf: MtbfDto;
  readonly top_costos_mantenimiento: TopCostoItemDto[];
  readonly cumplimiento_preventivo: CumplimientoItemDto[];
  readonly generado_en: string;
}

export interface DashboardResponseDto {
  readonly success: boolean;
  readonly data: DashboardDto;
}
