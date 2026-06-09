import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { FixedAssetOptionRepository } from './fixed-asset-option.repository';
import { FixedAssetOption } from './fixed-asset-option.model';

const GET_ALL_FIXED_ASSETS = gql`
  query GetAllFixedAssetsForSelector($offset: Int!, $limit: Int!) {
    getAllFixedAssets(offset: $offset, limit: $limit) {
      content { id name category location }
    }
  }
`;

@Injectable()
export class FixedAssetOptionRepositoryImpl extends FixedAssetOptionRepository {
  private readonly apollo = inject(Apollo);

  list(): Observable<FixedAssetOption[]> {
    return this.apollo
      .query<{ getAllFixedAssets: { content: FixedAssetOption[] } }>({
        query: GET_ALL_FIXED_ASSETS,
        variables: { offset: 0, limit: 200 },
        fetchPolicy: 'cache-first',
      })
      .pipe(map((r) => r.data!.getAllFixedAssets.content));
  }
}
