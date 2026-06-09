import { Observable } from 'rxjs';
import {
  MaintenanceRequest, MaintenanceRequestStatus, PaginatedRequestsResult,
  ListRequestsFilters, CreateMaintenanceRequestInput, UpdateStatusInput,
} from '../models/maintenance-request.model';

export abstract class MaintenanceRequestRepository {
  abstract list(filters: ListRequestsFilters): Observable<PaginatedRequestsResult>;
  abstract listByStatus(status: MaintenanceRequestStatus, filters: ListRequestsFilters): Observable<PaginatedRequestsResult>;
  abstract listByCreatedBy(createdBy: string, filters: ListRequestsFilters): Observable<PaginatedRequestsResult>;
  abstract getById(id: string): Observable<MaintenanceRequest>;
  abstract create(input: CreateMaintenanceRequestInput, solicitanteId: string): Observable<MaintenanceRequest>;
  abstract updateStatus(id: string, input: UpdateStatusInput): Observable<void>;
  abstract update(id: string, title: string, description: string): Observable<MaintenanceRequest>;
  abstract remove(id: string): Observable<void>;
}
