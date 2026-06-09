import { Observable, forkJoin, map } from 'rxjs';
import { MaintenanceRepository } from '../repositories/maintenance.repository';
import { MaintenanceRequestRepository } from '../../../solicitudes/domain/repositories/maintenance-request.repository';
import { CreateMaintenanceInput } from '../models/maintenance.model';

export class TomarResponsabilidadUseCase {
  constructor(
    private readonly maintenanceRepo: MaintenanceRepository,
    private readonly requestRepo: MaintenanceRequestRepository,
  ) {}

  execute(input: CreateMaintenanceInput): Observable<void> {
    const create$ = this.maintenanceRepo.create(input);
    const approve$ = this.requestRepo.updateStatus(input.maintenanceRequestId, {
      newStatus: 'APPROVED',
      technicianId: input.userId,
      diagnostico: input.description,
    });
    return forkJoin([create$, approve$]).pipe(map(() => undefined));
  }
}
