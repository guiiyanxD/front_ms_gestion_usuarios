import { Observable } from 'rxjs';
import { AreaOption } from './area-option.model';

export abstract class AreaOptionRepository {
  abstract list(): Observable<AreaOption[]>;
}
