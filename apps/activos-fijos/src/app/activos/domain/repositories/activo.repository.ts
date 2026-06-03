import { Observable } from 'rxjs';
import { Activo, ActivoSummary, CreateActivoInput } from '../models/activo.model';

export abstract class ActivoRepository {
  abstract list(): Observable<ActivoSummary[]>;
  abstract getById(id: string): Observable<Activo>;
  abstract create(input: CreateActivoInput): Observable<Activo>;
}
