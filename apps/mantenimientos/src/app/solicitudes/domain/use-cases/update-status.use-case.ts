import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';
import { UpdateStatusInput } from '../models/maintenance-request.model';

export class UpdateStatusUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(id: string, input: UpdateStatusInput): Observable<void> { return this.repo.updateStatus(id, input); }
}
