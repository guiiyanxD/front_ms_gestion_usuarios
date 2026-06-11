import { Observable } from 'rxjs';
import { ReporteRepository } from '../repositories/reporte.repository';
import { Reporte } from '../models/reporte.model';

export class ListReportesUseCase {
  constructor(private readonly repo: ReporteRepository) {}
  execute(): Observable<Reporte[]> {
    return this.repo.list();
  }
}
