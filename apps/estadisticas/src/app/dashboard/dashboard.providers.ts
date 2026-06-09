import { Provider } from '@angular/core';
import { DashboardRepository } from './domain/repositories/dashboard.repository';
import { DashboardRepositoryImpl } from './data/repositories/dashboard.repository.impl';
import { GetDashboardUseCase } from './domain/use-cases/get-dashboard.use-case';

export function provideDashboard(): Provider[] {
  return [
    { provide: DashboardRepository, useClass: DashboardRepositoryImpl },
    {
      provide: GetDashboardUseCase,
      useFactory: (r: DashboardRepository) => new GetDashboardUseCase(r),
      deps: [DashboardRepository],
    },
  ];
}
