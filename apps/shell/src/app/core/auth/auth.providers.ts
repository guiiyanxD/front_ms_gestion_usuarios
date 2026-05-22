// core/auth/auth.providers.ts
import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthRepository } from './domain/repositories/auth.repository';
import { AuthRepositoryImpl } from './data/repositories/auth.repository.impl';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { LogoutUseCase } from './domain/use-cases/logout.use-case';

export const API_GATEWAY_URL = new InjectionToken<string>('API_GATEWAY_URL');

export function provideAuth(): Provider[] {
  return [
    { provide: API_GATEWAY_URL, useValue: environment.apiGatewayUrl },
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    {
      provide: LoginUseCase,
      useFactory: (repo: AuthRepository) => new LoginUseCase(repo),
      deps: [AuthRepository],
    },
    {
      provide: LogoutUseCase,
      useFactory: (repo: AuthRepository) => new LogoutUseCase(repo),
      deps: [AuthRepository],
    },
  ];
}