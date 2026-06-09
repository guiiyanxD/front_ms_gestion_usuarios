import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { Dashboard } from '../../domain/models/dashboard.model';
import { DashboardResponseDto } from '../dto/dashboard.dto';
import { toDashboard } from '../mappers/dashboard.mapper';
import { environment } from '../../../../environments/environment';

@Injectable()
export class DashboardRepositoryImpl extends DashboardRepository {
  private readonly http = inject(HttpClient);

  get(): Observable<Dashboard> {
    return this.http
      .get<DashboardResponseDto>(`${environment.restBaseUrl}/kpis/dashboard`)
      .pipe(map((r) => toDashboard(r.data)));
  }
}
