import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { FixedAssetOptionRepository } from './fixed-asset-option.repository';
import { FixedAssetOption } from './fixed-asset-option.model';
import { environment } from '../../../environments/environment';

interface ActivoRestDto {
  id: string;
  codigo: string;
  name: string;
  category: string;
  location: string;
}

interface ActivosRestResponse {
  success: boolean;
  data: ActivoRestDto[];
}

// [GraphQL - comentado]
// const GET_ALL_FIXED_ASSETS = gql`
//   query GetAllFixedAssetsForSelector($offset: Int!, $limit: Int!) {
//     getAllFixedAssets(offset: $offset, limit: $limit) {
//       content { id name category location }
//     }
//   }
// `;

@Injectable()
export class FixedAssetOptionRepositoryImpl extends FixedAssetOptionRepository {
  private readonly http = inject(HttpClient);
  // private readonly apollo = inject(Apollo);

  list(): Observable<FixedAssetOption[]> {
    return this.http
      .get<ActivosRestResponse>(`${environment.restBaseUrl}/activos`)
      .pipe(
        map((res) => res.data.map((a) => ({
          id: a.id,
          codigo: a.codigo,
          name: a.name,
          category: a.category,
          location: a.location,
        })))
      );

    // [GraphQL - comentado]
    // return this.apollo
    //   .query<{ getAllFixedAssets: { content: FixedAssetOption[] } }>({
    //     query: GET_ALL_FIXED_ASSETS,
    //     variables: { offset: 0, limit: 200 },
    //     fetchPolicy: 'cache-first',
    //   })
    //   .pipe(map((r) => r.data!.getAllFixedAssets.content));
  }
}
