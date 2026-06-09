import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AreaOptionRepository } from './area-option.repository';
import { AreaOption } from './area-option.model';
import { environment } from '../../../environments/environment';

const AREAS_URL = `${environment.restBaseUrl}/catalogo/areas`;

@Injectable()
export class AreaOptionRepositoryImpl extends AreaOptionRepository {
  private readonly http = inject(HttpClient);

  list(): Observable<AreaOption[]> {
    return this.http
      .get<{ success: boolean; data: AreaOption[] }>(AREAS_URL)
      .pipe(map((r) => r.data));
  }
}
