import { Observable } from 'rxjs';
import { Activo } from '../models/activo.model';
import { ActivoRepository } from '../repositories/activo.repository';

export class GetActivoUseCase {
  constructor(private readonly repo: ActivoRepository) {}
  execute(id: string): Observable<Activo> { return this.repo.getById(id); }
}
