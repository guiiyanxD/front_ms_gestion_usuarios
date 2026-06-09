import { Observable } from 'rxjs';
import { FixedAssetOptionRepository } from './fixed-asset-option.repository';
import { FixedAssetOption } from './fixed-asset-option.model';

export class ListFixedAssetOptionsUseCase {
  constructor(private readonly repo: FixedAssetOptionRepository) {}
  execute(): Observable<FixedAssetOption[]> { return this.repo.list(); }
}
