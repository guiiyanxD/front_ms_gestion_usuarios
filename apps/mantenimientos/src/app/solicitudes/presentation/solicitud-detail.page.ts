import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesStore } from '../state/solicitudes.store';
import { SessionService } from '../../shared/session.service';
import { UpdateStatusInput, MaintenanceRequestStatus } from '../domain/models/maintenance-request.model';
import { CompletarRechazarFormComponent } from '../../mantenimientos/presentation/ui/completar-rechazar-form/completar-rechazar-form.component';
import { DiagnosticoFormComponent } from './ui/diagnostico-form/diagnostico-form.component';

type ActiveModal = null | 'diagnostico' | 'completar';

const STATUS_LABELS: Record<MaintenanceRequestStatus, string> = {
  PENDING: 'Pendiente', APPROVED: 'En proceso', COMPLETED: 'Completada',
};

@Component({
  selector: 'app-solicitud-detail-page',
  standalone: true,
  imports: [CompletarRechazarFormComponent, DiagnosticoFormComponent, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitud-detail.page.html',
  styleUrl: './solicitud-detail.page.css',
})
export class SolicitudDetailPage implements OnInit {
  private readonly store = inject(SolicitudesStore);
  readonly session = inject(SessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly solicitud = this.store.selected;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly activeModal = signal<ActiveModal>(null);
  readonly statusLabels = STATUS_LABELS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.loadOne(id);
  }

  onBack(): void { this.router.navigate(['mantenimientos']); }
  onCancel(): void { this.activeModal.set(null); }

  onTomar(): void {
    const id = this.solicitud()?.id;
    if (!id) return;
    const technicianId = this.session.restUserId ?? this.session.userId;
    this.store.updateStatus(id, { newStatus: 'APPROVED', technicianId }, () => {
      this.store.selectFromList({ ...this.solicitud()!, status: 'APPROVED' });
    });
  }

  onDiagnosticoSubmit(diagnostico: string): void {
    const id = this.solicitud()!.id;
    this.store.updateDiagnostico(id, diagnostico, () => {
      this.activeModal.set(null);
      this.store.selectFromList({ ...this.solicitud()!, diagnostico });
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
