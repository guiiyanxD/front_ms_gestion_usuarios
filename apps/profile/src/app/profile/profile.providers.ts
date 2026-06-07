import { Provider } from '@angular/core';
import { ProfileRepository } from './domain/repositories/profile.repository';
import { ProfileRepositoryImpl } from './data/repositories/profile.repository.impl';
import { GetProfileUseCase } from './domain/use-cases/get-profile.use-case';

export function provideProfile(): Provider[] {
  return [
    { provide: ProfileRepository, useClass: ProfileRepositoryImpl },
    {
      provide: GetProfileUseCase,
      useFactory: (repo: ProfileRepository) => new GetProfileUseCase(repo),
      deps: [ProfileRepository],
    },
  ];
}
