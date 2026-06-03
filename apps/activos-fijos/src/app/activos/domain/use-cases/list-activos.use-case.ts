import { Observable } from 'rxjs';
import { ActivoSummary } from '../models/activo.model';
import { ActivoRepository } from '../repositories/activo.repository';

export class ListActivosUseCase {
  constructor(private readonly repo: ActivoRepository) {}
  execute(): Observable<ActivoSummary[]> { return this.repo.list(); }
}
