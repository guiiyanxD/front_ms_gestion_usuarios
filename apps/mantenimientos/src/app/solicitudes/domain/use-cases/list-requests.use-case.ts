import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';
import { PaginatedRequestsResult, ListRequestsFilters } from '../models/maintenance-request.model';

export class ListRequestsUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(filters: ListRequestsFilters): Observable<PaginatedRequestsResult> { return this.repo.list(filters); }
}
