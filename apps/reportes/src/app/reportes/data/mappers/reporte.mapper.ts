import { ReporteDto } from '../dto/reporte.dto';
import { Reporte } from '../../domain/models/reporte.model';

const LABELS: Record<string, { label: string; descripcion: string }> = {
  'solicitudes-por-estado':      { label: 'Solicitudes por estado',         descripcion: 'Distribución de solicitudes de mantenimiento agrupadas por su estado actual.' },
  'depreciacion':                { label: 'Depreciación de activos',         descripcion: 'Cálculo del valor de depreciación acumulada de los activos fijos.' },
  'top-fallas':                  { label: 'Top fallas',                      descripcion: 'Activos con mayor frecuencia de fallas y solicitudes de mantenimiento correctivo.' },
  'productividad-tecnico':       { label: 'Productividad técnico',           descripcion: 'Métricas de rendimiento y solicitudes atendidas por cada técnico.' },
  'distribucion-area':           { label: 'Distribución por área',           descripcion: 'Cantidad y estado de los activos fijos agrupados por área.' },
  'inventario-activos':          { label: 'Inventario de activos',           descripcion: 'Listado completo del inventario de activos fijos con su estado y ubicación.' },
  'costos-mantenimiento-mensual':{ label: 'Costos de mantenimiento mensual', descripcion: 'Resumen mensual de los costos incurridos en mantenimientos completados.' },
  'vida-util-activos':           { label: 'Vida útil de activos',            descripcion: 'Estimación de la vida útil restante de cada activo basada en su fecha de adquisición.' },
};

const DEFAULT = { label: '', descripcion: 'Reporte de datos del sistema.' };

export function toReporte(dto: ReporteDto): Reporte {
  const meta = LABELS[dto.id] ?? { label: dto.id.replace(/-/g, ' '), descripcion: DEFAULT.descripcion };
  return {
    id: dto.id,
    endpoint: dto.endpoint,
    label: meta.label,
    descripcion: meta.descripcion,
  };
}
