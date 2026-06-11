import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Reporte, DownloadFormato } from '../../../domain/models/reporte.model';

export interface DownloadEvent {
  reporte: Reporte;
  formato: DownloadFormato;
}

type DownloadingState = { id: string; formato: DownloadFormato } | null;

@Component({
  selector: 'app-reporte-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reporte-card.component.html',
  styleUrl: './reporte-card.component.css',
})
export class ReporteCardComponent {
  readonly reporte = input.required<Reporte>();
  readonly downloadingState = input<DownloadingState>(null);
  readonly download = output<DownloadEvent>();

  readonly isDownloadingExcel = computed(() => {
    const d = this.downloadingState();
    return d?.id === this.reporte().id && d.formato === 'excel';
  });

  readonly isDownloadingPdf = computed(() => {
    const d = this.downloadingState();
    return d?.id === this.reporte().id && d.formato === 'pdf';
  });

  readonly anyDownloading = computed(() => this.downloadingState() !== null);

  onDownload(formato: DownloadFormato): void {
    this.download.emit({ reporte: this.reporte(), formato });
  }
}
