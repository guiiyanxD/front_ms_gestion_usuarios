import { computed, inject, Injectable, signal } from '@angular/core';
import { ListActivosUseCase } from '../domain/use-cases/list-activos.use-case';
import { GetActivoUseCase } from '../domain/use-cases/get-activo.use-case';
import { CreateActivoUseCase } from '../domain/use-cases/create-activo.use-case';
import { UpdateActivoUseCase } from '../domain/use-cases/update-activo.use-case';
import { DeleteActivoUseCase } from '../domain/use-cases/delete-activo.use-case';
import { AssignUserUseCase } from '../domain/use-cases/assign-user.use-case';
import { ListUserOptionsUseCase } from '../domain/use-cases/list-user-options.use-case';
import { Activo, ActivoCategory, ActivoStatus, ActivoSummary, CreateActivoInput, UpdateActivoInput } from '../domain/models/activo.model';
import { UserOption } from '../domain/models/user-option.model';

type Status = 'idle' | 'loading' | 'saving' | 'error';

const PAGE_SIZE = 10;

export interface AreaOption {
  id: number;
  name: string;
}

@Injectable()
export class ActivosStore {
  private readonly listUC = inject(ListActivosUseCase);
  private readonly getUC = inject(GetActivoUseCase);
  private readonly createUC = inject(CreateActivoUseCase);
  private readonly updateUC = inject(UpdateActivoUseCase);
  private readonly deleteUC = inject(DeleteActivoUseCase);
  private readonly assignUC = inject(AssignUserUseCase);
  private readonly listUsersUC = inject(ListUserOptionsUseCase);

  private readonly _activos = signal<ActivoSummary[]>([]);
  private readonly _selected = signal<Activo | null>(null);
  private readonly _editTarget = signal<Activo | null>(null);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _currentPage = signal(0);
  private readonly _totalPages = signal(0);
  private readonly _totalElements = signal(0);
  private readonly _hasNext = signal(false);
  private readonly _hasPrevious = signal(false);
  private readonly _userOptions = signal<UserOption[]>([]);

  private readonly _search = signal('');
  private readonly _filterCategoria = signal<ActivoCategory | ''>('');
  private readonly _filterEstado = signal<ActivoStatus | ''>('');
  private readonly _filterAreaId = signal<number>(0);

  readonly activos = this._activos.asReadonly();
  readonly selected = this._selected.asReadonly();
  readonly editTarget = this._editTarget.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly hasNext = this._hasNext.asReadonly();
  readonly hasPrevious = this._hasPrevious.asReadonly();
  readonly userOptions = this._userOptions.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isSaving = computed(() => this._status() === 'saving');
  readonly search = this._search.asReadonly();
  readonly filterCategoria = this._filterCategoria.asReadonly();
  readonly filterEstado = this._filterEstado.asReadonly();
  readonly filterAreaId = this._filterAreaId.asReadonly();

  readonly availableAreas = computed<AreaOption[]>(() => {
    const seen = new Set<number>();
    return this._activos()
      .filter((a) => a.areaId && !seen.has(a.areaId) && !!seen.add(a.areaId))
      .map((a) => ({ id: a.areaId, name: a.areaName }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly filteredActivos = computed<ActivoSummary[]>(() => {
    const q = this._search().toLowerCase().trim();
    const cat = this._filterCategoria();
    const est = this._filterEstado();
    const areaId = this._filterAreaId();

    return this._activos().filter((a) => {
      if (q && !a.name.toLowerCase().includes(q) && !a.codigo.toLowerCase().includes(q)) return false;
      if (cat && a.category !== cat) return false;
      if (est && a.status !== est) return false;
      if (areaId && a.areaId !== areaId) return false;
      return true;
    });
  });

  setSearch(v: string): void { this._search.set(v); }
  setFilterCategoria(v: ActivoCategory | ''): void { this._filterCategoria.set(v); }
  setFilterEstado(v: ActivoStatus | ''): void { this._filterEstado.set(v); }
  setFilterAreaId(v: number): void { this._filterAreaId.set(v); }
  clearFilters(): void {
    this._search.set('');
    this._filterCategoria.set('');
    this._filterEstado.set('');
    this._filterAreaId.set(0);
  }

  loadUserOptions(): void {
    this.listUsersUC.execute().subscribe({
      next: (users) => this._userOptions.set(users),
      error: () => this._userOptions.set([]),
    });
  }

  load(offset = 0): void {
    this._status.set('loading');
    this._error.set(null);
    this.listUC.execute({ offset, limit: PAGE_SIZE }).subscribe({
      next: (result) => {
        this._activos.set(result.content);
        this._currentPage.set(result.currentPage);
        this._totalPages.set(result.totalPages);
        this._totalElements.set(result.totalElements);
        this._hasNext.set(result.hasNext);
        this._hasPrevious.set(result.hasPrevious);
        this._status.set('idle');
      },
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar los activos.'); },
    });
  }

  nextPage(): void {
    if (this._hasNext()) this.load(this._currentPage() * PAGE_SIZE);
  }

  prevPage(): void {
    if (this._hasPrevious()) this.load((this._currentPage() - 2) * PAGE_SIZE);
  }

  selectFromList(summary: ActivoSummary): void {
    this._selected.set({
      id: summary.id,
      codigo: summary.codigo,
      name: summary.name,
      description: summary.description,
      category: summary.category,
      location: summary.location,
      status: summary.status,
      imageUrl: '',
      acquisitionDate: summary.acquisitionDate,
      areaName: summary.areaName,
      categoryName: summary.categoryName,
      user: null,
    });
  }

  loadOne(id: string): void {
    if (this._selected()?.id === id) return;
    this._status.set('loading');
    this._error.set(null);
    this._selected.set(null);
    this.getUC.execute(id).subscribe({
      next: (activo) => { this._selected.set(activo); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudo cargar el activo.'); },
    });
  }

  loadForEdit(id: string): void {
    this._error.set(null);
    this.getUC.execute(id).subscribe({
      next: (activo) => this._editTarget.set(activo),
      error: () => this._error.set('No se pudo cargar el activo para editar.'),
    });
  }

  clearEditTarget(): void {
    this._editTarget.set(null);
  }

  create(input: CreateActivoInput): void {
    this._status.set('saving');
    this._error.set(null);
    this.createUC.execute(input).subscribe({
      next: () => this.load(),
      error: () => { this._status.set('error'); this._error.set('No se pudo crear el activo.'); },
    });
  }

  update(id: string, input: UpdateActivoInput): void {
    this._status.set('saving');
    this._error.set(null);
    this.updateUC.execute(id, input).subscribe({
      next: () => this.load(this._currentPage() > 0 ? (this._currentPage() - 1) * PAGE_SIZE : 0),
      error: () => { this._status.set('error'); this._error.set('No se pudo actualizar el activo.'); },
    });
  }

  remove(id: string): void {
    this._status.set('saving');
    this._error.set(null);
    this.deleteUC.execute(id).subscribe({
      next: () => this.load(this._currentPage() > 0 ? (this._currentPage() - 1) * PAGE_SIZE : 0),
      error: () => { this._status.set('error'); this._error.set('No se pudo eliminar el activo.'); },
    });
  }

  assignUser(fixedAssetId: string, userId: string): void {
    this._status.set('saving');
    this._error.set(null);
    this.assignUC.execute(fixedAssetId, userId).subscribe({
      next: () => { this._status.set('idle'); this.loadOne(fixedAssetId); },
      error: () => { this._status.set('error'); this._error.set('No se pudo asignar el usuario.'); },
    });
  }
}
