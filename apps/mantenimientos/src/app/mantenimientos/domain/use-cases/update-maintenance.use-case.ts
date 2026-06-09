import { Observable } from 'rxjs';
import { MaintenanceRepository } from '../repositories/maintenance.repository';
import { Maintenance, UpdateMaintenanceInput } from '../models/maintenance.model';

export class UpdateMaintenanceUseCase {
  constructor(private readonly repo: MaintenanceRepository) {}
  execute(id: string, input: UpdateMaintenanceInput): Observable<Maintenance> { return this.repo.update(id, input); }
}
