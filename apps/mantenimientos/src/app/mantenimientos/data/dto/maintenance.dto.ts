import { MaintenanceType } from '../../domain/models/maintenance.model';

export interface MaintenanceRequestRefDto {
  id: string;
  title: string;
  description: string;
  status: string;
  fixedAsset: { id: string; name: string; category: string; description: string };
}

export interface MaintenanceDto {
  id: string;
  type: MaintenanceType;
  description: string;
  imageUrl?: string;
  maintenanceRequest: MaintenanceRequestRefDto;
}
