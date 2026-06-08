import { Observable } from 'rxjs';
import { ListActivosFilters, PaginatedActivosResult } from '../models/activo.model';
import { ActivoRepository } from '../repositories/activo.repository';

export class ListActivosUseCase {
  constructor(private readonly repo: ActivoRepository) {}
  execute(filters: ListActivosFilters): Observable<PaginatedActivosResult> {
    return this.repo.list(filters);
  }
}
