import { Provider } from '@angular/core';
import { AuthRepository } from './domain/repositories/auth.repository';
import { AuthRepositoryImpl } from './data/repositories/auth.repository.impl';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { LogoutUseCase } from './domain/use-cases/logout.use-case';

export function provideAuth(): Provider[] {
  return [
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
