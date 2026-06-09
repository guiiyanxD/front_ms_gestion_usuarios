import { Observable } from 'rxjs';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { Dashboard } from '../models/dashboard.model';

export class GetDashboardUseCase {
  constructor(private readonly repo: DashboardRepository) {}

  execute(): Observable<Dashboard> {
    return this.repo.get();
  }
}
