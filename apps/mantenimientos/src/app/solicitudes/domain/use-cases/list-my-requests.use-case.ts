import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';
import { PaginatedRequestsResult, ListRequestsFilters } from '../models/maintenance-request.model';

export class ListMyRequestsUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(createdBy: string, filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    return this.repo.listByCreatedBy(createdBy, filters);
  }
}
