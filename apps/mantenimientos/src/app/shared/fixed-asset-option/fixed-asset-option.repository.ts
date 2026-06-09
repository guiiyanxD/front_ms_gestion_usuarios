import { Observable } from 'rxjs';
import { FixedAssetOption } from './fixed-asset-option.model';

export abstract class FixedAssetOptionRepository {
  abstract list(): Observable<FixedAssetOption[]>;
}
