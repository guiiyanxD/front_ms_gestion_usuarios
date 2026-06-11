import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudesStore } from '../state/solicitudes.store';
import { SessionService } from '../../shared/session.service';
import { MaintenanceRequest, UpdateStatusInput } from '../domain/models/maintenance-request.model';
import { SolicitudCardComponent } from './ui/solicitud-card/solicitud-card.component';
import { CompletarRechazarFormComponent } from '../../mantenimientos/presentation/ui/completar-rechazar-form/completar-rechazar-form.component';
import { DiagnosticoFormComponent } from './ui/diagnostico-form/diagnostico-form.component';

type ActiveModal = null | 'diagnostico' | 'completar';

@Component({
  selector: 'app-mis-solicitudes-page',
  standalone: true,
  imports: [SolicitudCardComponent, CompletarRechazarFormComponent, DiagnosticoFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mis-solicitudes.page.html',
  styleUrl: './mis-solicitudes.page.css',
})
export class MisSolicitudesPage implements OnInit {
  private readonly store = inject(SolicitudesStore);
  readonly session = inject(SessionService);
  private readonly router = inject(Router);

  readonly requests = this.store.requests;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly isSaving = this.store.isSaving;
  readonly currentPage = this.store.currentPage;
  readonly totalPages = this.store.totalPages;
  readonly hasNext = this.store.hasNext;
  readonly hasPrevious = this.store.hasPrevious;

  readonly activeModal = signal<ActiveModal>(null);
  readonly selectedRequest = signal<MaintenanceRequest | null>(null);

  ngOnInit(): void {
    const tecnicoId = this.session.restUserId;
    if (tecnicoId) {
      this.store.loadByTechnician(tecnicoId);
    }
  }

  onView(r: MaintenanceRequest): void {
    this.store.selectFromList(r);
    this.router.navigate(['mantenimientos', r.id]);
  }

  onDiagnosticar(r: MaintenanceRequest): void {
    this.selectedRequest.set(r);
    this.activeModal.set('diagnostico');
  }

  onDiagnosticoSubmit(diagnostico: string): void {
    const id = this.selectedRequest()!.id;
    const tecnicoId = this.session.restUserId;
    this.store.updateDiagnostico(id, diagnostico, () => {
      this.activeModal.set(null);
      this.selectedRequest.set(null);
      if (tecnicoId) this.store.loadByTechnician(tecnicoId);
    });
  }

  onCompletar(r: MaintenanceRequest): void {
    this.selectedRequest.set(r);
    this.activeModal.set('completar');
  }

  onCancel(): void {
    this.activeModal.set(null);
    this.selectedRequest.set(null);
  }

  onCerrarSubmit(input: UpdateStatusInput): void {
    const id = this.selectedRequest()!.id;
    this.store.updateStatus(id, input, () => {
      this.activeModal.set(null);
      this.selectedRequest.set(null);
      const tecnicoId = this.session.restUserId;
      if (tecnicoId) this.store.loadByTechnician(tecnicoId);
    });
  }

  onNextPage(): void {
    const id = this.session.restUserId;
    if (id) this.store.nextPage((o) => this.store.loadByTechnician(id, o));
  }

  onPrevPage(): void {
    const id = this.session.restUserId;
    if (id) this.store.prevPage((o) => this.store.loadByTechnician(id, o));
  }
}
