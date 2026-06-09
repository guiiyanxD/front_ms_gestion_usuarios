import { Observable } from 'rxjs';
import { MaintenanceRepository } from '../repositories/maintenance.repository';

export class DeleteMaintenanceUseCase {
  constructor(private readonly repo: MaintenanceRepository) {}
  execute(id: string): Observable<void> { return this.repo.remove(id); }
}
