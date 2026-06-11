import { computed, inject, Injectable, signal } from '@angular/core';
import { ListActividadesUseCase } from '../domain/use-cases/list-actividades.use-case';
import { Actividad } from '../domain/models/actividad.model';

type Status = 'idle' | 'loading' | 'error';

const PAGE_SIZE = 10;

@Injectable()
export class ActividadesStore {
  private readonly listUC = inject(ListActividadesUseCase);

  private readonly _actividades = signal<Actividad[]>([]);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _currentPage = signal(0);
  private readonly _totalPages = signal(0);
  private readonly _totalElements = signal(0);
  private readonly _hasNext = signal(false);

  readonly actividades = this._actividades.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly hasNext = this._hasNext.asReadonly();
  readonly hasPrevious = computed(() => this._currentPage() > 1);
  readonly isLoading = computed(() => this._status() === 'loading');

  load(offset = 0): void {
    this._status.set('loading');
    this._error.set(null);
    this.listUC.execute({ offset, limit: PAGE_SIZE }).subscribe({
      next: (result) => {
        this._actividades.set(result.content);
        this._currentPage.set(result.currentPage);
        this._totalPages.set(result.totalPages);
        this._totalElements.set(result.totalElements);
        this._hasNext.set(result.hasNext);
        this._status.set('idle');
      },
      error: () => {
        this._status.set('error');
        this._error.set('No se pudieron cargar las actividades.');
      },
    });
  }

  nextPage(): void {
    if (this._hasNext()) this.load(this._currentPage() * PAGE_SIZE);
  }

  prevPage(): void {
    if (this.hasPrevious()) this.load((this._currentPage() - 2) * PAGE_SIZE);
  }
}
