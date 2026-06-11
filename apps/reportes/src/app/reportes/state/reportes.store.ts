import { computed, inject, Injectable, signal } from '@angular/core';
import { ListReportesUseCase } from '../domain/use-cases/list-reportes.use-case';
import { DownloadReporteUseCase } from '../domain/use-cases/download-reporte.use-case';
import { GetAreasUseCase } from '../domain/use-cases/get-areas.use-case';
import { Reporte, DownloadFormato, DownloadFilters } from '../domain/models/reporte.model';
import { Area } from '../domain/models/area.model';

type Status = 'idle' | 'loading' | 'error';
type DownloadingState = { id: string; formato: DownloadFormato } | null;

@Injectable()
export class ReportesStore {
  private readonly listUC = inject(ListReportesUseCase);
  private readonly downloadUC = inject(DownloadReporteUseCase);
  private readonly getAreasUC = inject(GetAreasUseCase);

  private readonly _reportes = signal<Reporte[]>([]);
  private readonly _areas = signal<Area[]>([]);
  private readonly _status = signal<Status>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _downloading = signal<DownloadingState>(null);

  private readonly _areaId = signal<number | null>(null);
  private readonly _fechaInicio = signal<string | null>(null);
  private readonly _fechaFin = signal<string | null>(null);

  readonly reportes = this._reportes.asReadonly();
  readonly areas = this._areas.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly downloading = this._downloading.asReadonly();
  readonly areaId = this._areaId.asReadonly();
  readonly fechaInicio = this._fechaInicio.asReadonly();
  readonly fechaFin = this._fechaFin.asReadonly();

  readonly selectedArea = computed(() =>
    this._areas().find((a) => a.id === this._areaId()) ?? null
  );

  loadAll(): void {
    this._status.set('loading');
    this._error.set(null);
    this.listUC.execute().subscribe({
      next: (r) => { this._reportes.set(r); this._status.set('idle'); },
      error: () => { this._status.set('error'); this._error.set('No se pudieron cargar los reportes.'); },
    });
  }

  loadAreas(): void {
    this.getAreasUC.execute().subscribe({
      next: (areas) => this._areas.set(areas),
      error: () => {},
    });
  }

  setAreaId(id: number | null): void { this._areaId.set(id); }
  setFechaInicio(v: string): void { this._fechaInicio.set(v || null); }
  setFechaFin(v: string): void { this._fechaFin.set(v || null); }

  download(reporte: Reporte, formato: DownloadFormato): void {
    this._downloading.set({ id: reporte.id, formato });
    this._error.set(null);

    const filters: DownloadFilters = {
      areaId: this._areaId() ?? undefined,
      fechaInicio: this._fechaInicio() ?? undefined,
      fechaFin: this._fechaFin() ?? undefined,
    };

    this.downloadUC.execute(reporte.endpoint, formato, filters).subscribe({
      next: (blob) => {
        this._downloading.set(null);
        triggerDownload(blob, reporte.id, formato);
      },
      error: () => {
        this._downloading.set(null);
        this._error.set(`No se pudo descargar el reporte "${reporte.label}".`);
      },
    });
  }
}

function triggerDownload(blob: Blob, filename: string, formato: DownloadFormato): void {
  const ext = formato === 'excel' ? 'xlsx' : 'pdf';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}
