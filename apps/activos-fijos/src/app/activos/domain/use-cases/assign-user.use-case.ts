import { Observable } from 'rxjs';
import { ActivoRepository } from '../repositories/activo.repository';

export class AssignUserUseCase {
  constructor(private readonly repo: ActivoRepository) {}
  execute(fixedAssetId: string, userId: string): Observable<void> {
    return this.repo.assignUser(fixedAssetId, userId);
  }
}
