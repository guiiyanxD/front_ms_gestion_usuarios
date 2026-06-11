import { Observable } from 'rxjs';
import { ReporteRepository } from '../repositories/reporte.repository';
import { Area } from '../models/area.model';

export class GetAreasUseCase {
  constructor(private readonly repo: ReporteRepository) {}
  execute(): Observable<Area[]> {
    return this.repo.listAreas();
  }
}
