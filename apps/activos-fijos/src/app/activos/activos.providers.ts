import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivoRepository } from './domain/repositories/activo.repository';
import { ActivoRepositoryImpl } from './data/repositories/activo.repository.impl';
import { SearchActivosUseCase } from './domain/use-cases/list-activos.use-case';
import { GetActivoUseCase } from './domain/use-cases/get-activo.use-case';
import { CreateActivoUseCase } from './domain/use-cases/create-activo.use-case';

export const ACTIVOS_GATEWAY_URL = new InjectionToken<string>('ACTIVOS_GATEWAY_URL');

export function provideActivos(): Provider[] {
  return [
    { provide: ACTIVOS_GATEWAY_URL, useValue: environment.apiGatewayUrl },
    { provide: ActivoRepository, useClass: ActivoRepositoryImpl },
    { provide: SearchActivosUseCase, useFactory: (r: ActivoRepository) => new SearchActivosUseCase(r), deps: [ActivoRepository] },
    { provide: GetActivoUseCase, useFactory: (r: ActivoRepository) => new GetActivoUseCase(r), deps: [ActivoRepository] },
    { provide: CreateActivoUseCase, useFactory: (r: ActivoRepository) => new CreateActivoUseCase(r), deps: [ActivoRepository] },
  ];
}
