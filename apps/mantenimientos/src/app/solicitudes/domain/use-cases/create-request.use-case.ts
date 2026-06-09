import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';
import { MaintenanceRequest, CreateMaintenanceRequestInput } from '../models/maintenance-request.model';

export class CreateRequestUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(input: CreateMaintenanceRequestInput, solicitanteId: string): Observable<MaintenanceRequest> {
    return this.repo.create(input, solicitanteId);
  }
}
