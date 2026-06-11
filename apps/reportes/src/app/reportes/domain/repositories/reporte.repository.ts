import { Observable } from 'rxjs';
import { Reporte, DownloadFormato, DownloadFilters } from '../models/reporte.model';
import { Area } from '../models/area.model';

export abstract class ReporteRepository {
  abstract list(): Observable<Reporte[]>;
  abstract download(endpoint: string, formato: DownloadFormato, filters?: DownloadFilters): Observable<Blob>;
  abstract listAreas(): Observable<Area[]>;
}
