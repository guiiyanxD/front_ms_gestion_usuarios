import { Observable } from 'rxjs';
import { MaintenanceRequestRepository } from '../../../solicitudes/domain/repositories/maintenance-request.repository';

export class TomarResponsabilidadUseCase {
  constructor(
    private readonly requestRepo: MaintenanceRequestRepository,
  ) {}

  execute(requestId: string, technicianId: string): Observable<void> {
    return this.requestRepo.updateStatus(requestId, {
      newStatus: 'APPROVED',
      technicianId,
    });
  }
}
