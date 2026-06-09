import { Provider } from '@angular/core';
import { MaintenanceRepository } from './domain/repositories/maintenance.repository';
import { MaintenanceRepositoryImpl } from './data/repositories/maintenance.repository.impl';
import { MaintenanceRequestRepository } from '../solicitudes/domain/repositories/maintenance-request.repository';
import { ListMaintenancesByUserUseCase } from './domain/use-cases/list-by-user.use-case';
import { ListMaintenancesByRequestUseCase } from './domain/use-cases/list-by-request.use-case';
import { TomarResponsabilidadUseCase } from './domain/use-cases/tomar-responsabilidad.use-case';
import { DeleteMaintenanceUseCase } from './domain/use-cases/delete-maintenance.use-case';
import { UpdateMaintenanceUseCase } from './domain/use-cases/update-maintenance.use-case';
import { UserOptionRepository } from '../shared/user-option/user-option.repository';
import { UserOptionRepositoryImpl } from '../shared/user-option/user-option.repository.impl';
import { ListUserOptionsUseCase } from '../shared/user-option/list-user-options.use-case';

export function provideMantenimientos(): Provider[] {
  return [
    { provide: MaintenanceRepository, useClass: MaintenanceRepositoryImpl },
    { provide: UserOptionRepository, useClass: UserOptionRepositoryImpl },
    { provide: ListMaintenancesByUserUseCase, useFactory: (r: MaintenanceRepository) => new ListMaintenancesByUserUseCase(r), deps: [MaintenanceRepository] },
    { provide: ListMaintenancesByRequestUseCase, useFactory: (r: MaintenanceRepository) => new ListMaintenancesByRequestUseCase(r), deps: [MaintenanceRepository] },
    {
      provide: TomarResponsabilidadUseCase,
      useFactory: (mr: MaintenanceRepository, rr: MaintenanceRequestRepository) => new TomarResponsabilidadUseCase(mr, rr),
      deps: [MaintenanceRepository, MaintenanceRequestRepository],
    },
    { provide: DeleteMaintenanceUseCase, useFactory: (r: MaintenanceRepository) => new DeleteMaintenanceUseCase(r), deps: [MaintenanceRepository] },
    { provide: UpdateMaintenanceUseCase, useFactory: (r: MaintenanceRepository) => new UpdateMaintenanceUseCase(r), deps: [MaintenanceRepository] },
    { provide: ListUserOptionsUseCase, useFactory: (r: UserOptionRepository) => new ListUserOptionsUseCase(r), deps: [UserOptionRepository] },
  ];
}
