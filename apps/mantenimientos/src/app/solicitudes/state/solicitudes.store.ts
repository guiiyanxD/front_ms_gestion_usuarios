import { computed, inject, Injectable, signal } from '@angular/core';
import { ListRequestsUseCase } from '../domain/use-cases/list-requests.use-case';
import { ListRequestsByStatusUseCase } from '../domain/use-cases/list-requests-by-status.use-case';
import { ListMyRequestsUseCase } from '../domain/use-cases/list-my-requests.use-case';
import { ListRequestsByTechnicianUseCase } from '../domain/use-cases/list-requests-by-technician.use-case';
import { GetRequestUseCase } from '../domain/use-cases/get-request.use-case';
import { CreateRequestUseCase } from '../domain/use-cases/create-request.use-case';
import { UpdateStatusUseCase } from '../domain/use-cases/update-status.use-case';
import { UpdateDiagnosticoUseCase } from '../domain/use-cases/update-diagnostico.use-case';
import { DeleteRequestUseCase } from '../domain/use-cases/delete-request.use-case';
import { MaintenanceRequest, PaginatedRequestsResult, CreateMaintenanceRequestInput, UpdateStatusInput, ListRequestsFilters } from '../domain/models/maintenance-request.model';

type SearchFilters = Pick<ListRequestsFilters, 'codigo' | 'prioridad' | 'status'>;
import { FixedAssetOption } from '../../shared/fixed-asset-option/fixed-asset-option.model';
import { AreaOption } from '../../shared/area-option/area-option.model';
import { ListFixedAssetOptionsUseCase } from '../../shared/fixed-asset-option/list-fixed-asset-options.use-case';
import { ListAreaOptionsUseCase } from '../../shared/area-option/list-area-options.use-case';

type Status = 'idle' | 'loading' | 'saving' | 'error';
const PAGE_SIZE = 10;

@Injectable()
export class SolicitudesStore {
  private readonly listUC = inject(ListRequestsUseCase);
  private readonly listByStatusUC = inject(ListRequestsByStatusUseCase);
  private readonly listMyUC = inject(ListMyRequestsUseCase);
  private readonly listByTechnicianUC = inject(ListRequestsByTechnicianUseCase);
  private readonly getUC = inject(GetRequestUseCase);
  private readonly createUC = inject(CreateRequestUseCase);
  private readonly updateStatusUC = inject(UpdateStatusUseCase);
  private readonly updateDiagnosticoUC = inject(UpdateDiagnosticoUseCase);
  private readonly deleteUC = inject(DeleteRequestUseCase);
  private readonly listAssetsUC = inject(ListFixedAssetOptionsUseCase);
  private readonly listAreasUC = inject(ListAreaOptionsUseCase);

  private readonly _requests = signal<MaintenanceRequest[]>([]);
  private readonly _selected = signal<MaintenanceRequest | null>(null);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _currentPage = signal(0);
  private readonly _totalPages = signal(0);
  private readonly _totalElements = signal(0);
  private readonly _hasNext = signal(false);
  private readonly _hasPrevious = signal(false);
  private readonly _fixedAssets = signal<FixedAssetOption[]>([]);
  private readonly _areas = signal<AreaOption[]>([]);

  readonly requests = this._requests.asReadonly();
  readonly selected = this._selected.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly hasNext = this._hasNext.asReadonly();
  readonly hasPrevious = this._hasPrevious.asReadonly();
  readonly fixedAssets = this._fixedAssets.asReadonly();
  readonly areas = this._areas.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isSaving = computed(() => this._status() === 'saving');

  private setPage(result: PaginatedRequestsResult): void {
    this._requests.set(result.content);
    this._currentPage.set(result.currentPage);
    this._totalPages.set(result.totalPages);
    this._totalElements.set(result.totalElements);
    this._hasNext.set(result.hasNext);
    this._hasPrevious.set(result.hasPrevious);
    this._status.set('idle');
  }

  loadAll(offset = 0, search: SearchFilters = {}): void {
    this._status.set('loading');
    this._error.set(null);
    this.listUC.execute({ offset, limit: PAGE_SIZE, ...search }).subscribe({
      next: (r) => this.setPage(r),
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar las solicitudes.'); },
    });
  }

  loadPending(offset = 0, search: SearchFilters = {}): void {
    this._status.set('loading');
    this._error.set(null);
    this.listByStatusUC.execute('PENDING', { offset, limit: PAGE_SIZE, ...search }).subscribe({
      next: (r) => this.setPage(r),
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar las solicitudes pendientes.'); },
    });
  }

  loadByTechnician(tecnicoId: string, offset = 0, search: SearchFilters = {}): void {
    this._status.set('loading');
    this._error.set(null);
    this.listByTechnicianUC.execute(tecnicoId, { offset, limit: PAGE_SIZE, ...search }).subscribe({
      next: (r) => this.setPage(r),
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar tus solicitudes atendidas.'); },
    });
  }

  loadMine(createdBy: string, offset = 0, search: SearchFilters = {}): void {
    this._status.set('loading');
    this._error.set(null);
    this.listMyUC.execute(createdBy, { offset, limit: PAGE_SIZE, ...search }).subscribe({
      next: (r) => this.setPage(r),
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar tus solicitudes.'); },
    });
  }

  selectFromList(request: MaintenanceRequest): void {
    this._selected.set(request);
  }

  loadOne(id: string): void {
    // si no hay datos pre-cargados para este id, mostrar spinner mientras carga
    if (!this._selected() || this._selected()?.id !== id) {
      this._status.set('loading');
      this._selected.set(null);
    }
    this._error.set(null);
    this.getUC.execute(id).subscribe({
      next: (r) => { this._selected.set(r); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudo cargar la solicitud.'); },
    });
  }

  create(input: CreateMaintenanceRequestInput, solicitanteId: string, reloadFn: () => void): void {
    this._status.set('saving');
    this._error.set(null);
    this.createUC.execute(input, solicitanteId).subscribe({
      next: () => reloadFn(),
      error: () => { this._status.set('error'); this._error.set('No se pudo crear la solicitud.'); },
    });
  }

  updateStatus(id: string, input: UpdateStatusInput, reloadFn: () => void): void {
    this._status.set('saving');
    this._error.set(null);
    this.updateStatusUC.execute(id, input).subscribe({
      next: () => reloadFn(),
      error: () => { this._status.set('error'); this._error.set('No se pudo actualizar el estado.'); },
    });
  }

  updateDiagnostico(id: string, diagnostico: string, reloadFn: () => void): void {
    this._status.set('saving');
    this._error.set(null);
    this.updateDiagnosticoUC.execute(id, diagnostico).subscribe({
      next: () => reloadFn(),
      error: () => { this._status.set('error'); this._error.set('No se pudo guardar el diagnóstico.'); },
    });
  }

  remove(id: string, reloadFn: () => void): void {
    this._status.set('saving');
    this._error.set(null);
    this.deleteUC.execute(id).subscribe({
      next: () => reloadFn(),
      error: () => { this._status.set('error'); this._error.set('No se pudo eliminar la solicitud.'); },
    });
  }

  loadCatalogs(): void {
    this.listAssetsUC.execute().subscribe({ next: (a) => this._fixedAssets.set(a), error: () => {} });
    this.listAreasUC.execute().subscribe({ next: (a) => this._areas.set(a), error: () => {} });
  }

  nextPage(loader: (offset: number) => void): void {
    if (this._hasNext()) loader(this._currentPage() * PAGE_SIZE);
  }

  prevPage(loader: (offset: number) => void): void {
    if (this._hasPrevious()) loader((this._currentPage() - 2) * PAGE_SIZE);
  }
}
