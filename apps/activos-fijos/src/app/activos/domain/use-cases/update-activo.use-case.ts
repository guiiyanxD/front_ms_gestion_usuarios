import { Observable } from 'rxjs';
import { Activo, UpdateActivoInput } from '../models/activo.model';
import { ActivoRepository } from '../repositories/activo.repository';

export class UpdateActivoUseCase {
  constructor(private readonly repo: ActivoRepository) {}
  execute(id: string, input: UpdateActivoInput): Observable<Activo> { return this.repo.update(id, input); }
}
