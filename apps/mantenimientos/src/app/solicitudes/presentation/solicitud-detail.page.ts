import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesStore } from '../state/solicitudes.store';
import { MantenimientosStore } from '../../mantenimientos/state/mantenimientos.store';
import { SessionService } from '../../shared/session.service';
import { UpdateStatusInput, MaintenanceRequestStatus } from '../domain/models/maintenance-request.model';
import { CreateMaintenanceInput } from '../../mantenimientos/domain/models/maintenance.model';
import { TomarFormComponent } from '../../mantenimientos/presentation/ui/tomar-form/tomar-form.component';
import { CompletarRechazarFormComponent } from '../../mantenimientos/presentation/ui/completar-rechazar-form/completar-rechazar-form.component';

type ActiveModal = null | 'tomar' | 'completar' | 'rechazar';

const STATUS_LABELS: Record<MaintenanceRequestStatus, string> = {
  PENDING: 'Pendiente', APPROVED: 'Aprobada', REJECTED: 'Rechazada', COMPLETED: 'Completada',
};

@Component({
  selector: 'app-solicitud-detail-page',
  standalone: true,
  imports: [TomarFormComponent, CompletarRechazarFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitud-detail.page.html',
  styleUrl: './solicitud-detail.page.css',
})
export class SolicitudDetailPage implements OnInit {
  private readonly store = inject(SolicitudesStore);
  readonly mantStore = inject(MantenimientosStore);
  readonly session = inject(SessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly solicitud = this.store.selected;
  readonly maintenances = this.mantStore.maintenances;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly activeModal = signal<ActiveModal>(null);
  readonly statusLabels = STATUS_LABELS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.loadOne(id);
      this.mantStore.loadByRequest(id);
    }
  }

  onBack(): void { this.router.navigate(['mantenimientos']); }
  onCancel(): void { this.activeModal.set(null); }

  onTomarSubmit(input: CreateMaintenanceInput): void {
    this.mantStore.tomar(input, () => {
      this.activeModal.set(null);
      const id = this.solicitud()?.id;
      if (id) { this.store.loadOne(id); this.mantStore.loadByRequest(id); }
    });
  }

  onCerrarSubmit(input: UpdateStatusInput): void {
    const id = this.solicitud()!.id;
    this.store.updateStatus(id, input, () => {
      this.activeModal.set(null);
      this.store.loadOne(id);
    });
  }
}
