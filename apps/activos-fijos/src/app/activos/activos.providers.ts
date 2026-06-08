import { Provider } from '@angular/core';
import { ActivoRepository } from './domain/repositories/activo.repository';
import { ActivoRepositoryImpl } from './data/repositories/activo.repository.impl';
import { ListActivosUseCase } from './domain/use-cases/list-activos.use-case';
import { GetActivoUseCase } from './domain/use-cases/get-activo.use-case';
import { CreateActivoUseCase } from './domain/use-cases/create-activo.use-case';
import { UpdateActivoUseCase } from './domain/use-cases/update-activo.use-case';
import { DeleteActivoUseCase } from './domain/use-cases/delete-activo.use-case';
import { AssignUserUseCase } from './domain/use-cases/assign-user.use-case';

export function provideActivos(): Provider[] {
  return [
    { provide: ActivoRepository, useClass: ActivoRepositoryImpl },
    { provide: ListActivosUseCase, useFactory: (r: ActivoRepository) => new ListActivosUseCase(r), deps: [ActivoRepository] },
    { provide: GetActivoUseCase, useFactory: (r: ActivoRepository) => new GetActivoUseCase(r), deps: [ActivoRepository] },
    { provide: CreateActivoUseCase, useFactory: (r: ActivoRepository) => new CreateActivoUseCase(r), deps: [ActivoRepository] },
    { provide: UpdateActivoUseCase, useFactory: (r: ActivoRepository) => new UpdateActivoUseCase(r), deps: [ActivoRepository] },
    { provide: DeleteActivoUseCase, useFactory: (r: ActivoRepository) => new DeleteActivoUseCase(r), deps: [ActivoRepository] },
    { provide: AssignUserUseCase, useFactory: (r: ActivoRepository) => new AssignUserUseCase(r), deps: [ActivoRepository] },
  ];
}
