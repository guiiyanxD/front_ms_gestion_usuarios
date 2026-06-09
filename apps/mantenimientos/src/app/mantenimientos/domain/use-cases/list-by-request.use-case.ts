import { Observable } from 'rxjs';
import { MaintenanceRepository } from '../repositories/maintenance.repository';
import { Maintenance } from '../models/maintenance.model';

export class ListMaintenancesByRequestUseCase {
  constructor(private readonly repo: MaintenanceRepository) {}
  execute(requestId: string): Observable<Maintenance[]> { return this.repo.listByRequest(requestId); }
}
