import { Provider } from '@angular/core';
import { MaintenanceRequestRepository } from './domain/repositories/maintenance-request.repository';
import { MaintenanceRequestRepositoryImpl } from './data/repositories/maintenance-request.repository.impl';
import { ListRequestsUseCase } from './domain/use-cases/list-requests.use-case';
import { ListRequestsByStatusUseCase } from './domain/use-cases/list-requests-by-status.use-case';
import { ListMyRequestsUseCase } from './domain/use-cases/list-my-requests.use-case';
import { ListRequestsByTechnicianUseCase } from './domain/use-cases/list-requests-by-technician.use-case';
import { GetRequestUseCase } from './domain/use-cases/get-request.use-case';
import { CreateRequestUseCase } from './domain/use-cases/create-request.use-case';
import { UpdateStatusUseCase } from './domain/use-cases/update-status.use-case';
import { UpdateDiagnosticoUseCase } from './domain/use-cases/update-diagnostico.use-case';
import { DeleteRequestUseCase } from './domain/use-cases/delete-request.use-case';
import { FixedAssetOptionRepository } from '../shared/fixed-asset-option/fixed-asset-option.repository';
import { FixedAssetOptionRepositoryImpl } from '../shared/fixed-asset-option/fixed-asset-option.repository.impl';
import { ListFixedAssetOptionsUseCase } from '../shared/fixed-asset-option/list-fixed-asset-options.use-case';
import { AreaOptionRepository } from '../shared/area-option/area-option.repository';
import { AreaOptionRepositoryImpl } from '../shared/area-option/area-option.repository.impl';
import { ListAreaOptionsUseCase } from '../shared/area-option/list-area-options.use-case';

export function provideSolicitudes(): Provider[] {
  return [
    { provide: MaintenanceRequestRepository, useClass: MaintenanceRequestRepositoryImpl },
    { provide: FixedAssetOptionRepository, useClass: FixedAssetOptionRepositoryImpl },
    { provide: AreaOptionRepository, useClass: AreaOptionRepositoryImpl },
    { provide: ListRequestsUseCase, useFactory: (r: MaintenanceRequestRepository) => new ListRequestsUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: ListRequestsByStatusUseCase, useFactory: (r: MaintenanceRequestRepository) => new ListRequestsByStatusUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: ListMyRequestsUseCase, useFactory: (r: MaintenanceRequestRepository) => new ListMyRequestsUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: ListRequestsByTechnicianUseCase, useFactory: (r: MaintenanceRequestRepository) => new ListRequestsByTechnicianUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: GetRequestUseCase, useFactory: (r: MaintenanceRequestRepository) => new GetRequestUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: CreateRequestUseCase, useFactory: (r: MaintenanceRequestRepository) => new CreateRequestUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: UpdateStatusUseCase, useFactory: (r: MaintenanceRequestRepository) => new UpdateStatusUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: UpdateDiagnosticoUseCase, useFactory: (r: MaintenanceRequestRepository) => new UpdateDiagnosticoUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: DeleteRequestUseCase, useFactory: (r: MaintenanceRequestRepository) => new DeleteRequestUseCase(r), deps: [MaintenanceRequestRepository] },
    { provide: ListFixedAssetOptionsUseCase, useFactory: (r: FixedAssetOptionRepository) => new ListFixedAssetOptionsUseCase(r), deps: [FixedAssetOptionRepository] },
    { provide: ListAreaOptionsUseCase, useFactory: (r: AreaOptionRepository) => new ListAreaOptionsUseCase(r), deps: [AreaOptionRepository] },
  ];
}
