import { Observable } from 'rxjs';
import { UserOptionRepository } from './user-option.repository';
import { UserOption } from './user-option.model';

export class ListUserOptionsUseCase {
  constructor(private readonly repo: UserOptionRepository) {}
  execute(): Observable<UserOption[]> { return this.repo.list(); }
}
