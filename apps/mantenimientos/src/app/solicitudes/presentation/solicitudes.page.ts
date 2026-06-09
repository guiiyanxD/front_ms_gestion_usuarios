import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudesStore } from '../state/solicitudes.store';
import { MantenimientosStore } from '../../mantenimientos/state/mantenimientos.store';
import { SessionService } from '../../shared/session.service';
import { MaintenanceRequest, CreateMaintenanceRequestInput, UpdateStatusInput } from '../domain/models/maintenance-request.model';
import { CreateMaintenanceInput } from '../../mantenimientos/domain/models/maintenance.model';
import { SolicitudCardComponent } from './ui/solicitud-card/solicitud-card.component';
import { SolicitudFormComponent } from './ui/solicitud-form/solicitud-form.component';
import { TomarFormComponent } from '../../mantenimientos/presentation/ui/tomar-form/tomar-form.component';
import { CompletarRechazarFormComponent } from '../../mantenimientos/presentation/ui/completar-rechazar-form/completar-rechazar-form.component';

type ActiveModal = null | 'nueva-solicitud' | 'tomar' | 'completar' | 'rechazar';

@Component({
  selector: 'app-solicitudes-page',
  standalone: true,
  imports: [SolicitudCardComponent, SolicitudFormComponent, TomarFormComponent, CompletarRechazarFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitudes.page.html',
  styleUrl: './solicitudes.page.css',
})
export class SolicitudesPage implements OnInit {
  private readonly store = inject(SolicitudesStore);
  readonly mantStore = inject(MantenimientosStore);
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
  readonly fixedAssets = this.store.fixedAssets;
  readonly areas = this.store.areas;

  readonly activeModal = signal<ActiveModal>(null);
  readonly selectedRequest = signal<MaintenanceRequest | null>(null);

  ngOnInit(): void {
    this.store.loadCatalogs();
    this.loadByRole();
  }

  private loadByRole(offset = 0): void {
    if (this.session.isAdmin()) {
      this.store.loadAll(offset);
    } else if (this.session.isTecnico()) {
      this.store.loadPending(offset);
    } else {
      this.store.loadMine(this.session.username, offset);
    }
  }

  onNew(): void { this.activeModal.set('nueva-solicitud'); }
  onCancel(): void { this.activeModal.set(null); this.selectedRequest.set(null); }

  onView(r: MaintenanceRequest): void {
    this.router.navigate(['mantenimientos', r.id]);
  }

  onTomar(r: MaintenanceRequest): void {
    this.selectedRequest.set(r);
    this.activeModal.set('tomar');
  }

  onCompletar(r: MaintenanceRequest): void {
    this.selectedRequest.set(r);
    this.activeModal.set('completar');
  }

  onRechazar(r: MaintenanceRequest): void {
    this.selectedRequest.set(r);
    this.activeModal.set('rechazar');
  }

  onDelete(r: MaintenanceRequest): void {
    if (confirm(`¿Eliminar la solicitud "${r.title}"?`)) {
      this.store.remove(r.id, () => this.loadByRole());
    }
  }

  onSolicitudSubmit(input: CreateMaintenanceRequestInput): void {
    this.store.create(input, this.session.userId, () => {
      this.activeModal.set(null);
      this.loadByRole();
    });
  }

  onTomarSubmit(input: CreateMaintenanceInput): void {
    this.mantStore.tomar(input, () => {
      this.activeModal.set(null);
      this.selectedRequest.set(null);
      this.loadByRole();
    });
  }

  onCerrarSubmit(input: UpdateStatusInput): void {
    const id = this.selectedRequest()!.id;
    this.store.updateStatus(id, input, () => {
      this.activeModal.set(null);
      this.selectedRequest.set(null);
      this.loadByRole();
    });
  }

  onNextPage(): void { this.store.nextPage((o) => this.loadByRole(o)); }
  onPrevPage(): void { this.store.prevPage((o) => this.loadByRole(o)); }
}
