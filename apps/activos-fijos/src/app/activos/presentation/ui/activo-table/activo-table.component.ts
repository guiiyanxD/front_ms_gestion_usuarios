import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ActivoCategory, ActivoStatus, ActivoSummary } from '../../../domain/models/activo.model';

const CATEGORY_LABELS: Record<ActivoCategory, string> = {
  ELECTRONIC_EQUIPMENT: 'Equipo electrónico',
  HVAC_EQUIPMENT: 'Equipo HVAC',
  FIXTURES: 'Instalaciones',
  OTHERS: 'Otros',
};

const STATUS_LABELS: Record<ActivoStatus, string> = {
  ACTIVE: 'Activo',
  IN_STORAGE: 'En almacén',
  UNDER_MAINTENANCE: 'En mantenimiento',
  DAMAGED: 'Dañado',
  RETIRED: 'Retirado',
  LOST: 'Perdido',
};

@Component({
  selector: 'app-activo-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activo-table.component.html',
  styleUrl: './activo-table.component.css',
})
export class ActivoTableComponent {
  readonly activos = input.required<ActivoSummary[]>();
  readonly view = output<ActivoSummary>();
  readonly edit = output<ActivoSummary>();
  readonly remove = output<ActivoSummary>();

  categoryLabel(cat: ActivoCategory): string { return CATEGORY_LABELS[cat] ?? cat; }
  statusLabel(s: ActivoStatus): string { return STATUS_LABELS[s] ?? s; }
}
