import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReportesStore } from '../state/reportes.store';
import { DownloadEvent, ReporteCardComponent } from './ui/reporte-card/reporte-card.component';
import { AreaSearchComponent } from './ui/area-search/area-search.component';
import { Area } from '../domain/models/area.model';

@Component({
  selector: 'app-reportes-page',
  standalone: true,
  imports: [ReporteCardComponent, AreaSearchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reportes.page.html',
  styleUrl: './reportes.page.css',
})
export class ReportesPage implements OnInit {
  private readonly store = inject(ReportesStore);

  readonly reportes = this.store.reportes;
  readonly areas = this.store.areas;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly downloading = this.store.downloading;
  readonly selectedArea = this.store.selectedArea;

  ngOnInit(): void {
    this.store.loadAll();
    this.store.loadAreas();
  }

  onAreaSelected(area: Area | null): void {
    this.store.setAreaId(area?.id ?? null);
  }

  onFechaInicio(value: string): void {
    this.store.setFechaInicio(value);
  }

  onFechaFin(value: string): void {
    this.store.setFechaFin(value);
  }

  onDownload(event: DownloadEvent): void {
    this.store.download(event.reporte, event.formato);
  }
}
