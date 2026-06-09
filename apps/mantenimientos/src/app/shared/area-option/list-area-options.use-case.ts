import { Observable } from 'rxjs';
import { AreaOptionRepository } from './area-option.repository';
import { AreaOption } from './area-option.model';

export class ListAreaOptionsUseCase {
  constructor(private readonly repo: AreaOptionRepository) {}
  execute(): Observable<AreaOption[]> { return this.repo.list(); }
}
