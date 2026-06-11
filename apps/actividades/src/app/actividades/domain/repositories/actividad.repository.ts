import { Observable } from 'rxjs';
import { PaginatedActividadesResult, ListActividadesFilters } from '../models/actividad.model';

export abstract class ActividadRepository {
  abstract list(filters: ListActividadesFilters): Observable<PaginatedActividadesResult>;
}
