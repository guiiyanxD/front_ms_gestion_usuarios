import { Observable } from 'rxjs';
import { Activo, CreateActivoInput, ListActivosFilters, PaginatedActivosResult, UpdateActivoInput } from '../models/activo.model';

export abstract class ActivoRepository {
  abstract list(filters: ListActivosFilters): Observable<PaginatedActivosResult>;
  abstract getById(id: string): Observable<Activo>;
  abstract create(input: CreateActivoInput): Observable<Activo>;
  abstract update(id: string, input: UpdateActivoInput): Observable<Activo>;
  abstract remove(id: string): Observable<void>;
  abstract assignUser(fixedAssetId: string, userId: string): Observable<void>;
}
