import { Observable } from 'rxjs';
import { SearchActivoFilters, SearchActivoResult } from '../models/activo.model';
import { ActivoRepository } from '../repositories/activo.repository';

export class SearchActivosUseCase {
  constructor(private readonly repo: ActivoRepository) {}
  execute(filters: SearchActivoFilters): Observable<SearchActivoResult> {
    return this.repo.search(filters);
  }
}
