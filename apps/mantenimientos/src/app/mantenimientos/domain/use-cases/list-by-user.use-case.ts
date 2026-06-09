import { Observable } from 'rxjs';
import { MaintenanceRepository } from '../repositories/maintenance.repository';
import { Maintenance } from '../models/maintenance.model';

export class ListMaintenancesByUserUseCase {
  constructor(private readonly repo: MaintenanceRepository) {}
  execute(userId: string): Observable<Maintenance[]> { return this.repo.listByUser(userId); }
}
