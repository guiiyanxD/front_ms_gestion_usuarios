import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Actividad } from '../../../domain/models/actividad.model';

@Component({
  selector: 'app-actividad-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './actividad-table.component.html',
  styleUrl: './actividad-table.component.css',
})
export class ActividadTableComponent {
  readonly actividades = input.required<Actividad[]>();
}
