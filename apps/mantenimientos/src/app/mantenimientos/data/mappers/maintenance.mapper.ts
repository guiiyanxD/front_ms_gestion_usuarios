import { MaintenanceDto } from '../dto/maintenance.dto';
import { Maintenance } from '../../domain/models/maintenance.model';

export function toMaintenance(dto: MaintenanceDto): Maintenance {
  return {
    id: dto.id,
    type: dto.type,
    description: dto.description ?? '',
    imageUrl: dto.imageUrl,
    maintenanceRequest: {
      id: dto.maintenanceRequest?.id ?? '',
      title: dto.maintenanceRequest?.title ?? '',
      description: dto.maintenanceRequest?.description ?? '',
      status: dto.maintenanceRequest?.status ?? '',
      fixedAsset: {
        id: dto.maintenanceRequest?.fixedAsset?.id ?? '',
        name: dto.maintenanceRequest?.fixedAsset?.name ?? '',
        category: dto.maintenanceRequest?.fixedAsset?.category ?? '',
      },
    },
  };
}
