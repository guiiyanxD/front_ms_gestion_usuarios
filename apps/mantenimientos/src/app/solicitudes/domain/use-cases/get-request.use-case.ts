import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';
import { MaintenanceRequest } from '../models/maintenance-request.model';

export class GetRequestUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(id: string): Observable<MaintenanceRequest> { return this.repo.getById(id); }
}
