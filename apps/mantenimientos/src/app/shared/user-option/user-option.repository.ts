import { Observable } from 'rxjs';
import { UserOption } from './user-option.model';

export abstract class UserOptionRepository {
  abstract list(): Observable<UserOption[]>;
}
