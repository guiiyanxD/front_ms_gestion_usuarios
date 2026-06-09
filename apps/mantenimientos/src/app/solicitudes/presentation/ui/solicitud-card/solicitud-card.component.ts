import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MaintenanceRequest, MaintenanceRequestStatus } from '../../../domain/models/maintenance-request.model';

const STATUS_LABELS: Record<MaintenanceRequestStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  COMPLETED: 'Completada',
};

@Component({
  selector: 'app-solicitud-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitud-card.component.html',
  styleUrl: './solicitud-card.component.css',
})
export class SolicitudCardComponent {
  readonly request = input.required<MaintenanceRequest>();
  readonly showTomar = input<boolean>(false);
  readonly showCerrar = input<boolean>(false);
  readonly view = output<MaintenanceRequest>();
  readonly tomar = output<MaintenanceRequest>();
  readonly completar = output<MaintenanceRequest>();
  readonly rechazar = output<MaintenanceRequest>();
  readonly remove = output<MaintenanceRequest>();

  readonly statusLabels = STATUS_LABELS;
}
