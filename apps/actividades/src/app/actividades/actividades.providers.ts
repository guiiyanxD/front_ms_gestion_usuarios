import { Provider } from '@angular/core';
import { ActividadRepository } from './domain/repositories/actividad.repository';
import { ActividadRepositoryImpl } from './data/repositories/actividad.repository.impl';
import { ListActividadesUseCase } from './domain/use-cases/list-actividades.use-case';

export function provideActividades(): Provider[] {
  return [
    { provide: ActividadRepository, useClass: ActividadRepositoryImpl },
    {
      provide: ListActividadesUseCase,
      useFactory: (r: ActividadRepository) => new ListActividadesUseCase(r),
      deps: [ActividadRepository],
    },
  ];
}
