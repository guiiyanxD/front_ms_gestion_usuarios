import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';

export class DeleteRequestUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(id: string): Observable<void> { return this.repo.remove(id); }
}
