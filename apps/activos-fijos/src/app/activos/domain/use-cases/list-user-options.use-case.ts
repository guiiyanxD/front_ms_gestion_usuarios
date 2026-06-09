import { Observable } from 'rxjs';
import { UserOptionRepository } from '../repositories/user-option.repository';
import { UserOption } from '../models/user-option.model';

export class ListUserOptionsUseCase {
  constructor(private readonly repo: UserOptionRepository) {}

  execute(): Observable<UserOption[]> {
    return this.repo.list();
  }
}
