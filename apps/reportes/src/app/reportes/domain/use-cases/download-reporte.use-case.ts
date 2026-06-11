import { Observable } from 'rxjs';
import { ReporteRepository } from '../repositories/reporte.repository';
import { DownloadFormato, DownloadFilters } from '../models/reporte.model';

export class DownloadReporteUseCase {
  constructor(private readonly repo: ReporteRepository) {}
  execute(endpoint: string, formato: DownloadFormato, filters?: DownloadFilters): Observable<Blob> {
    return this.repo.download(endpoint, formato, filters);
  }
}
