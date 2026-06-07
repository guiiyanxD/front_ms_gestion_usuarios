import { Provider } from '@angular/core';
import { UserRepository } from './domain/repositories/user.repository';
import { UserRepositoryImpl } from './data/repositories/user.repository.impl';
import { ListUsersUseCase } from './domain/use-cases/list-users.use-case';
import { CreateUserUseCase } from './domain/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './domain/use-cases/update-user.use-case';
import { ListRoleOptionsUseCase } from './domain/use-cases/list-role-options.use-case';

export function provideUsers(): Provider[] {
  return [
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: ListUsersUseCase, useFactory: (r: UserRepository) => new ListUsersUseCase(r), deps: [UserRepository] },
    { provide: CreateUserUseCase, useFactory: (r: UserRepository) => new CreateUserUseCase(r), deps: [UserRepository] },
    { provide: UpdateUserUseCase, useFactory: (r: UserRepository) => new UpdateUserUseCase(r), deps: [UserRepository] },
    { provide: ListRoleOptionsUseCase, useFactory: (r: UserRepository) => new ListRoleOptionsUseCase(r), deps: [UserRepository] },
  ];
}
