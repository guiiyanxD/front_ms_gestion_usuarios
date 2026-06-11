import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ReporteRepository } from '../../domain/repositories/reporte.repository';
import { Reporte, DownloadFormato, DownloadFilters } from '../../domain/models/reporte.model';
import { Area } from '../../domain/models/area.model';
import { ReportesResponseDto } from '../dto/reporte.dto';
import { AreasResponseDto } from '../dto/area.dto';
import { toReporte } from '../mappers/reporte.mapper';
import { toArea } from '../mappers/area.mapper';
import { environment } from '../../../../environments/environment';

const REST_BASE = environment.restBaseUrl;
const REST_ROOT = REST_BASE.replace('/api/v1', '');

@Injectable()
export class ReporteRepositoryImpl extends ReporteRepository {
  private readonly http = inject(HttpClient);

  list(): Observable<Reporte[]> {
    return this.http
      .get<ReportesResponseDto>(`${REST_BASE}/reportes`)
      .pipe(map((r) => r.data.map(toReporte)));
  }

  download(endpoint: string, formato: DownloadFormato, filters?: DownloadFilters): Observable<Blob> {
    const params = new URLSearchParams({ formato });
    if (filters?.areaId != null) params.set('areaId', String(filters.areaId));
    if (filters?.fechaInicio) params.set('fechaInicio', filters.fechaInicio);
    if (filters?.fechaFin) params.set('fechaFin', filters.fechaFin);
    return this.http.get(`${REST_ROOT}${endpoint}?${params.toString()}`, {
      responseType: 'blob',
    });
  }

  listAreas(): Observable<Area[]> {
    return this.http
      .get<AreasResponseDto>(`${REST_BASE}/catalogo/areas`)
      .pipe(map((r) => r.data.map(toArea)));
  }
}
