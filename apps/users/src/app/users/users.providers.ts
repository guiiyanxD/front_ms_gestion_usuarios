import { InjectionToken, Provider } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserRepository } from './domain/repositories/user.repository';
import { UserRepositoryImpl } from './data/repositories/user.repository.impl';
import { ListUsersUseCase } from './domain/use-cases/list-users.use-case';
import { CreateUserUseCase } from './domain/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './domain/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './domain/use-cases/delete-user.use-case';
import { ListRoleOptionsUseCase } from './domain/use-cases/list-role-options.use-case';

export const USERS_GATEWAY_URL = new InjectionToken<string>('USERS_GATEWAY_URL');

export function provideUsers(): Provider[] {
  return [
    { provide: USERS_GATEWAY_URL, useValue: environment.apiGatewayUrl },
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: ListUsersUseCase, useFactory: (r: UserRepository) => new ListUsersUseCase(r), deps: [UserRepository] },
    { provide: CreateUserUseCase, useFactory: (r: UserRepository) => new CreateUserUseCase(r), deps: [UserRepository] },
    { provide: UpdateUserUseCase, useFactory: (r: UserRepository) => new UpdateUserUseCase(r), deps: [UserRepository] },
    { provide: DeleteUserUseCase, useFactory: (r: UserRepository) => new DeleteUserUseCase(r), deps: [UserRepository] },
    { provide: ListRoleOptionsUseCase, useFactory: (r: UserRepository) => new ListRoleOptionsUseCase(r), deps: [UserRepository] },
  ];
}