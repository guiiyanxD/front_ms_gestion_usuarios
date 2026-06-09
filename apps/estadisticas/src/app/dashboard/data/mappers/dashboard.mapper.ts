import { DashboardDto } from '../dto/dashboard.dto';
import { Dashboard } from '../../domain/models/dashboard.model';

const n = (v: string) => parseFloat(v) || 0;

export function toDashboard(dto: DashboardDto): Dashboard {
  return {
    disponibilidad: {
      totalActivos: n(dto.disponibilidad.total_activos),
      activosOperativos: n(dto.disponibilidad.activos_operativos),
      activosEnMantenimiento: n(dto.disponibilidad.activos_en_mantenimiento),
      activosFueraServicio: n(dto.disponibilidad.activos_fuera_servicio),
      activosBaja: n(dto.disponibilidad.activos_baja),
      tasaDisponibilidadPct: n(dto.disponibilidad.tasa_disponibilidad_pct),
    },
    mttr: {
      solicitudesCompletadas: n(dto.mttr.solicitudes_completadas),
      mttrHoras: n(dto.mttr.mttr_horas),
      mttrDias: n(dto.mttr.mttr_dias),
    },
    mtbf: {
      mtbfDias: n(dto.mtbf.mtbf_dias),
      numObservaciones: n(dto.mtbf.num_observaciones),
    },
    topCostosMantenimiento: dto.top_costos_mantenimiento.map((item) => ({
      activoId: item.activo_id,
      codigo: item.codigo,
      activoNombre: item.activo_nombre,
      areaNombre: item.area_nombre,
      numMantenimientos: n(item.num_mantenimientos),
      costoTotal: n(item.costo_total),
      costoPromedio: n(item.costo_promedio),
    })),
    cumplimientoPreventivo: dto.cumplimiento_preventivo.map((item) => ({
      periodo: item.periodo,
      preventivosTotal: n(item.preventivos_total),
      preventivosCompletados: n(item.preventivos_completados),
      cumplimientoPct: n(item.cumplimiento_pct),
    })),
    generadoEn: dto.generado_en,
  };
}
