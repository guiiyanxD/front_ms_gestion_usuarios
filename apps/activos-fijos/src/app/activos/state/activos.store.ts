import { computed, inject, Injectable, signal } from '@angular/core';
import { SearchActivosUseCase } from '../domain/use-cases/list-activos.use-case';
import { GetActivoUseCase } from '../domain/use-cases/get-activo.use-case';
import { CreateActivoUseCase } from '../domain/use-cases/create-activo.use-case';
import { Activo, ActivoSummary, CreateActivoInput, SearchActivoFilters } from '../domain/models/activo.model';

type Status = 'idle' | 'loading' | 'saving' | 'error';

@Injectable()
export class ActivosStore {
  private readonly searchUC = inject(SearchActivosUseCase);
  private readonly getUC = inject(GetActivoUseCase);
  private readonly createUC = inject(CreateActivoUseCase);

  private readonly _activos = signal<ActivoSummary[]>([]);
  private readonly _selected = signal<Activo | null>(null);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _hasSearched = signal(false);
  private readonly _total = signal(0);
  private readonly _queryInterpreted = signal('');
  private readonly _lastFilters = signal<SearchActivoFilters | null>(null);

  readonly activos = this._activos.asReadonly();
  readonly selected = this._selected.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasSearched = this._hasSearched.asReadonly();
  readonly total = this._total.asReadonly();
  readonly queryInterpreted = this._queryInterpreted.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isSaving = computed(() => this._status() === 'saving');

  search(filters: SearchActivoFilters): void {
    this._lastFilters.set(filters);
    this._status.set('loading');
    this._error.set(null);
    this.searchUC.execute(filters).subscribe({
      next: (result) => {
        this._activos.set(result.items);
        this._total.set(result.total);
        this._queryInterpreted.set(result.queryInterpreted);
        this._hasSearched.set(true);
        this._status.set('idle');
      },
      error: () => { this._status.set('error'); this._error.set('No se pudo realizar la búsqueda.'); },
    });
  }

  loadOne(id: string): void {
    this._status.set('loading');
    this._error.set(null);
    this._selected.set(null);
    this.getUC.execute(id).subscribe({
      next: (activo) => { this._selected.set(activo); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudo cargar el activo.'); },
    });
  }

  create(input: CreateActivoInput): void {
    this._status.set('saving');
    this._error.set(null);
    this.createUC.execute(input).subscribe({
      next: () => {
        const last = this._lastFilters();
        if (last) this.search(last);
        else this._status.set('idle');
      },
      error: () => { this._status.set('error'); this._error.set('No se pudo crear el activo.'); },
    });
  }
}
