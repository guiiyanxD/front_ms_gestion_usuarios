import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../repositories/maintenance-request.repository';

export class UpdateDiagnosticoUseCase {
  constructor(private readonly repo: MaintenanceRequestRepository) {}
  execute(id: string, diagnostico: string): Observable<void> {
    return this.repo.updateDiagnostico(id, diagnostico);
  }
}
