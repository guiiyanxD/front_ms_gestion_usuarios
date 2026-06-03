import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ActivoSummary } from '../../../domain/models/activo.model';

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
}
