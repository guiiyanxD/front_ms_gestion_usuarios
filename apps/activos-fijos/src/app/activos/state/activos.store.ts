import { computed, inject, Injectable, signal } from '@angular/core';
import { ListActivosUseCase } from '../domain/use-cases/list-activos.use-case';
import { GetActivoUseCase } from '../domain/use-cases/get-activo.use-case';
import { CreateActivoUseCase } from '../domain/use-cases/create-activo.use-case';
import { Activo, ActivoSummary, CreateActivoInput } from '../domain/models/activo.model';

type Status = 'idle' | 'loading' | 'saving' | 'error';

@Injectable()
export class ActivosStore {
  private readonly listUC = inject(ListActivosUseCase);
  private readonly getUC = inject(GetActivoUseCase);
  private readonly createUC = inject(CreateActivoUseCase);

  private readonly _activos = signal<ActivoSummary[]>([]);
  private readonly _selected = signal<Activo | null>(null);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);

  readonly activos = this._activos.asReadonly();
  readonly selected = this._selected.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');
  readonly isSaving = computed(() => this._status() === 'saving');

  load(): void {
    this._status.set('loading');
    this._error.set(null);
    this.listUC.execute().subscribe({
      next: (items) => { this._activos.set(items); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar los activos.'); },
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
      next: () => this.load(),
      error: () => { this._status.set('error'); this._error.set('No se pudo crear el activo.'); },
    });
  }
}
