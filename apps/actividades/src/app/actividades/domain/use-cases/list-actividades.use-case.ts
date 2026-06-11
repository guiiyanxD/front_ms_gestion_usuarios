import { Observable } from 'rxjs';
import { ActividadRepository } from '../repositories/actividad.repository';
import { PaginatedActividadesResult, ListActividadesFilters } from '../models/actividad.model';

export class ListActividadesUseCase {
  constructor(private readonly repo: ActividadRepository) {}
  execute(filters: ListActividadesFilters): Observable<PaginatedActividadesResult> {
    return this.repo.list(filters);
  }
}
