import { Observable } from 'rxjs';
import { UserOption } from '../models/user-option.model';

export abstract class UserOptionRepository {
  abstract list(): Observable<UserOption[]>;
}
