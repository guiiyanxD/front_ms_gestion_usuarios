import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AreaOptionRepository } from './area-option.repository';
import { AreaOption } from './area-option.model';

const AREAS_URL = 'https://ms-bi-automation.onrender.com/api/v1/catalogo/areas';

@Injectable()
export class AreaOptionRepositoryImpl extends AreaOptionRepository {
  private readonly http = inject(HttpClient);

  list(): Observable<AreaOption[]> {
    return this.http
      .get<{ success: boolean; data: AreaOption[] }>(AREAS_URL)
      .pipe(map((r) => r.data));
  }
}
