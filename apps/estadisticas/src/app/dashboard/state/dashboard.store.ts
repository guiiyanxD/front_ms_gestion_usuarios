import { computed, inject, Injectable, signal } from '@angular/core';
import { GetDashboardUseCase } from '../domain/use-cases/get-dashboard.use-case';
import { Dashboard } from '../domain/models/dashboard.model';

type Status = 'idle' | 'loading' | 'error';

@Injectable()
export class DashboardStore {
  private readonly getUC = inject(GetDashboardUseCase);

  private readonly _dashboard = signal<Dashboard | null>(null);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);

  readonly dashboard = this._dashboard.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoading = computed(() => this._status() === 'loading');

  load(): void {
    this._status.set('loading');
    this._error.set(null);
    this.getUC.execute().subscribe({
      next: (d) => { this._dashboard.set(d); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudo cargar el dashboard.'); },
    });
  }
}
