import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ActividadRepository } from '../../domain/repositories/actividad.repository';
import { PaginatedActividadesResult, ListActividadesFilters } from '../../domain/models/actividad.model';
import { GetAllActivitiesResponseDto } from '../dto/actividad.dto';
import { toPaginatedActividades } from '../mappers/actividad.mapper';
import { environment } from '../../../../environments/environment';

const GET_ALL_ACTIVITIES = `
  query GetAllActivities($limit: Int!, $offset: Int!) {
    getAllActivities(limit: $limit, offset: $offset) {
      content { id actionName description createdBy }
      currentPage
      hasNext
      totalPages
      totalElements
    }
  }
`;

@Injectable()
export class ActividadRepositoryImpl extends ActividadRepository {
  private readonly http = inject(HttpClient);

  list(filters: ListActividadesFilters): Observable<PaginatedActividadesResult> {
    return this.http
      .post<GetAllActivitiesResponseDto>(environment.graphqlUrl, {
        query: GET_ALL_ACTIVITIES,
        variables: { limit: filters.limit, offset: filters.offset },
      })
      .pipe(map((r) => toPaginatedActividades(r.data.getAllActivities)));
  }
}
