import { Observable } from 'rxjs';
import { Activo, CreateActivoInput } from '../models/activo.model';
import { ActivoRepository } from '../repositories/activo.repository';

export class CreateActivoUseCase {
  constructor(private readonly repo: ActivoRepository) {}
  execute(input: CreateActivoInput): Observable<Activo> { return this.repo.create(input); }
}
