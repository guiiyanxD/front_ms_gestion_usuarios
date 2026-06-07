import { Observable } from 'rxjs';
import { Activo, ActivoSummary, CreateActivoInput, SearchActivoFilters, SearchActivoResult } from '../models/activo.model';

export abstract class ActivoRepository {
  abstract search(filters: SearchActivoFilters): Observable<SearchActivoResult>;
  abstract getById(id: string): Observable<Activo>;
  abstract create(input: CreateActivoInput): Observable<Activo>;
}
