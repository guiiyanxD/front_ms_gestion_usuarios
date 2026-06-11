import { Provider } from '@angular/core';
import { ReporteRepository } from './domain/repositories/reporte.repository';
import { ReporteRepositoryImpl } from './data/repositories/reporte.repository.impl';
import { ListReportesUseCase } from './domain/use-cases/list-reportes.use-case';
import { DownloadReporteUseCase } from './domain/use-cases/download-reporte.use-case';
import { GetAreasUseCase } from './domain/use-cases/get-areas.use-case';

export function provideReportes(): Provider[] {
  return [
    { provide: ReporteRepository, useClass: ReporteRepositoryImpl },
    {
      provide: ListReportesUseCase,
      useFactory: (r: ReporteRepository) => new ListReportesUseCase(r),
      deps: [ReporteRepository],
    },
    {
      provide: DownloadReporteUseCase,
      useFactory: (r: ReporteRepository) => new DownloadReporteUseCase(r),
      deps: [ReporteRepository],
    },
    {
      provide: GetAreasUseCase,
      useFactory: (r: ReporteRepository) => new GetAreasUseCase(r),
      deps: [ReporteRepository],
    },
  ];
}
