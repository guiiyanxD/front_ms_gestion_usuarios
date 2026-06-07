import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ActivoRepository } from '../../domain/repositories/activo.repository';
import { Activo, CreateActivoInput, SearchActivoFilters, SearchActivoResult } from '../../domain/models/activo.model';
import { ActivoDto, SearchActivoRequestDto, SearchActivoResponseDto } from '../dto/activo.dto';
import { toActivo, toSearchResult, toCreateActivoDto } from '../mappers/activo.mapper';
import { ACTIVOS_GATEWAY_URL } from '../../activos.providers';

@Injectable()
export class ActivoRepositoryImpl extends ActivoRepository {
  private readonly http = inject(HttpClient);
  private readonly gateway = inject(ACTIVOS_GATEWAY_URL);

  search(filters: SearchActivoFilters): Observable<SearchActivoResult> {
    const body: SearchActivoRequestDto = {
      query: filters.query,
      categoria: filters.categoria,
      ubicacion: filters.ubicacion,
      limit: filters.limit,
    };
    return this.http
      .post<SearchActivoResponseDto>(`${this.gateway}/api/v1/search/text`, body)
      .pipe(map(toSearchResult));
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
