export type MaintenanceType = 'CORRECTIVE' | 'PREVENTIVE';

export interface MaintenanceRequestRef {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly fixedAsset: { readonly id: string; readonly name: string; readonly category: string };
}

export interface Maintenance {
  readonly id: string;
  readonly type: MaintenanceType;
  readonly description: string;
  readonly imageUrl?: string;
  readonly maintenanceRequest: MaintenanceRequestRef;
}

export interface CreateMaintenanceInput {
  readonly maintenanceRequestId: string;
  readonly type: MaintenanceType;
  readonly description: string;
  readonly userId: string;
  readonly imageUrl?: string;
}

export interface UpdateMaintenanceInput {
  readonly type?: MaintenanceType;
  readonly description?: string;
  readonly imageUrl?: string;
}
