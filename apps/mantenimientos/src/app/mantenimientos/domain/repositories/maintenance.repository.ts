import { Observable } from 'rxjs';
import { Maintenance, CreateMaintenanceInput, UpdateMaintenanceInput } from '../models/maintenance.model';

export abstract class MaintenanceRepository {
  abstract listByUser(userId: string): Observable<Maintenance[]>;
  abstract listByRequest(requestId: string): Observable<Maintenance[]>;
  abstract getById(id: string): Observable<Maintenance>;
  abstract create(input: CreateMaintenanceInput): Observable<Maintenance>;
  abstract update(id: string, input: UpdateMaintenanceInput): Observable<Maintenance>;
  abstract remove(id: string): Observable<void>;
}
