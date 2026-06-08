import { Observable } from 'rxjs';
import { ActivoRepository } from '../repositories/activo.repository';

export class DeleteActivoUseCase {
  constructor(private readonly repo: ActivoRepository) {}
  execute(id: string): Observable<void> { return this.repo.remove(id); }
}
