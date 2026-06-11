import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudesStore } from '../state/solicitudes.store';
import { SessionService } from '../../shared/session.service';
import { MaintenanceRequest, CreateMaintenanceRequestInput, UpdateStatusInput, MaintenancePrioridad, MaintenanceRequestStatus } from '../domain/models/maintenance-request.model';
import { SolicitudCardComponent } from './ui/solicitud-card/solicitud-card.component';
import { SolicitudFormComponent } from './ui/solicitud-form/solicitud-form.component';
import { CompletarRechazarFormComponent } from '../../mantenimientos/presentation/ui/completar-rechazar-form/completar-rechazar-form.component';
import { DiagnosticoFormComponent } from './ui/diagnostico-form/diagnostico-form.component';

type ActiveModal = null | 'nueva-solicitud' | 'diagnostico' | 'completar';

@Component({
  selector: 'app-solicitudes-page',
  standalone: true,
  imports: [SolicitudCardComponent, SolicitudFormComponent, CompletarRechazarFormComponent, DiagnosticoFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitudes.page.html',
  styleUrl: './solicitudes.page.css',
})
export class SolicitudesPage implements OnInit {
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
  readonly fixedAssets = this.store.fixedAssets;
  readonly areas = this.store.areas;

  readonly activeModal = signal<ActiveModal>(null);
  readonly selectedRequest = signal<MaintenanceRequest | null>(null);

  readonly searchCodigo = signal('');
  readonly filterPrioridad = signal<MaintenancePrioridad | ''>('');
  readonly filterStatus = signal<MaintenanceRequestStatus | ''>('');

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.store.loadCatalogs();
    this.loadByRole();
  }

  private currentSearch() {
    return {
      codigo: this.searchCodigo() || undefined,
      prioridad: this.filterPrioridad() || undefined,
      status: this.filterStatus() || undefined,
    };
  }

  private loadByRole(offset = 0): void {
    const search = this.currentSearch();
    if (this.session.isAdmin()) {
      this.store.loadAll(offset, search);
    } else if (this.session.isTecnico()) {
      this.store.loadPending(offset, search);
    } else {
      this.store.loadMine(this.session.restUserId ?? this.session.userId, offset, search);
    }
  }

  onSearchInput(value: string): void {
    this.searchCodigo.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadByRole(0), 400);
  }

  onFilterChange(): void {
    this.loadByRole(0);
  }

  onClearFilters(): void {
    this.searchCodigo.set('');
    this.filterPrioridad.set('');
    this.filterStatus.set('');
    this.loadByRole(0);
  }

  onNew(): void { this.activeModal.set('nueva-solicitud'); }
  onCancel(): void { this.activeModal.set(null); this.selectedRequest.set(null); }

  onView(r: MaintenanceRequest): void {
    this.store.selectFromList(r);
    this.router.navigate(['mantenimientos', r.id]);
  }

  onTomar(r: MaintenanceRequest): void {
    const technicianId = this.session.restUserId ?? this.session.userId;
    this.store.updateStatus(r.id, { newStatus: 'APPROVED', technicianId }, () => {
      this.loadByRole();
    });
  }

  onDiagnosticar(r: MaintenanceRequest): void {
    this.selectedRequest.set(r);
    this.activeModal.set('diagnostico');
  }

  onDiagnosticoSubmit(diagnostico: string): void {
    const id = this.selectedRequest()!.id;
    this.store.updateDiagnostico(id, diagnostico, () => {
      this.activeModal.set(null);
      this.selectedRequest.set(null);
      this.loadByRole();
    });
  }

  onCompletar(r: MaintenanceRequest): void {
    this.selectedRequest.set(r);
    this.activeModal.set('completar');
  }

  onDelete(r: MaintenanceRequest): void {
    if (confirm(`¿Eliminar la solicitud "${r.title}"?`)) {
      this.store.remove(r.id, () => this.loadByRole());
    }
  }

  onSolicitudSubmit(input: CreateMaintenanceRequestInput): void {
    this.store.create(input, this.session.restUserId ?? this.session.userId, () => {
      this.activeModal.set(null);
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
