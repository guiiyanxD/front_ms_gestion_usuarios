import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';
import { MaintenanceRequestStatus, PaginatedRequestsResult, ListRequestsFilters } from '../models/maintenance-request.model';

export class ListRequestsByStatusUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(status: MaintenanceRequestStatus, filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    return this.repo.listByStatus(status, filters);
  }
}
