import { Observable } from 'rxjs';
import { Dashboard } from '../models/dashboard.model';

export abstract class DashboardRepository {
  abstract get(): Observable<Dashboard>;
}
