import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';
import { PaginatedRequestsResult, ListRequestsFilters } from '../models/maintenance-request.model';

export class ListRequestsByTechnicianUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(tecnicoId: string, filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    return this.repo.listByTechnician(tecnicoId, filters);
  }
}
