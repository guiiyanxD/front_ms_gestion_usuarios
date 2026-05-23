import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProfileRepository } from './domain/repositories/profile.repository';
import { ProfileRepositoryImpl } from './data/repositories/profile.repository.impl';
import { GetProfileUseCase } from './domain/use-cases/get-profile.use-case';

export const PROFILE_GATEWAY_URL = new InjectionToken<string>('PROFILE_GATEWAY_URL');

export function provideProfile(): Provider[] {
  return [
    { provide: PROFILE_GATEWAY_URL, useValue: environment.apiGatewayUrl },
    { provide: ProfileRepository, useClass: ProfileRepositoryImpl },
    {
      provide: GetProfileUseCase,
      useFactory: (repo: ProfileRepository) => new GetProfileUseCase(repo),
      deps: [ProfileRepository],
    },
  ];
}