import { Provider } from '@angular/core';
import { RoleRepository } from './domain/repositories/role.repository';
import { RoleRepositoryImpl } from './data/repositories/role.repository.impl';
import { ListRolesUseCase } from './domain/use-cases/list-roles.use-case';
import { CreateRoleUseCase } from './domain/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from './domain/use-cases/delete-role.use-case';

export function provideRoles(): Provider[] {
  return [
    { provide: RoleRepository, useClass: RoleRepositoryImpl },
    { provide: ListRolesUseCase, useFactory: (r: RoleRepository) => new ListRolesUseCase(r), deps: [RoleRepository] },
    { provide: CreateRoleUseCase, useFactory: (r: RoleRepository) => new CreateRoleUseCase(r), deps: [RoleRepository] },
    { provide: DeleteRoleUseCase, useFactory: (r: RoleRepository) => new DeleteRoleUseCase(r), deps: [RoleRepository] },
  ];
}
