import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ActivoRepository } from '../../domain/repositories/activo.repository';
import { Activo, ActivoSummary, CreateActivoInput } from '../../domain/models/activo.model';
import { ActivoDto, PaginatedActivosDto } from '../dto/activo.dto';
import { toActivo, toActivoSummary, toCreateActivoDto } from '../mappers/activo.mapper';
import { ACTIVOS_GATEWAY_URL } from '../../activos.providers';

@Injectable()
export class ActivoRepositoryImpl extends ActivoRepository {
  private readonly http = inject(HttpClient);
  private readonly gateway = inject(ACTIVOS_GATEWAY_URL);

  list(): Observable<ActivoSummary[]> {
    return this.http
      .get<PaginatedActivosDto>(`${this.gateway}/v1/assets`)
      .pipe(map((res) => res.data.map(toActivoSummary)));
  }

  getById(id: string): Observable<Activo> {
    return this.http
      .get<ActivoDto>(`${this.gateway}/v1/assets/${id}`)
      .pipe(map(toActivo));
  }

  create(input: CreateActivoInput): Observable<Activo> {
    return this.http
      .post<ActivoDto>(`${this.gateway}/v1/assets`, toCreateActivoDto(input))
      .pipe(map(toActivo));
  }
}
