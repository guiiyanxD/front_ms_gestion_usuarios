import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { ActivoRepository } from '../../domain/repositories/activo.repository';
import { Activo, CreateActivoInput, ListActivosFilters, PaginatedActivosResult, UpdateActivoInput } from '../../domain/models/activo.model';
import { ActivoDto, CreateActivoRestDto, CreateActivoRestResponseDto, PaginatedActivosDtoResult } from '../dto/activo.dto';
import { toActivo, toPaginatedResult } from '../mappers/activo.mapper';

const REST_BASE_URL = 'https://ms-ia-busqueda.duckdns.org';

const GET_ALL_FIXED_ASSETS = gql`
  query GetAllFixedAssets($offset: Int!, $limit: Int!) {
    getAllFixedAssets(offset: $offset, limit: $limit) {
      content { id name category status location }
      currentPage totalPages totalElements hasNext hasPrevious
    }
  }
`;

const GET_FIXED_ASSET_BY_ID = gql`
  query GetFixedAssetById($id: ID!) {
    getFixedAssetById(id: $id) {
      id name description category location status imageUrl acquisitionDate
      user { firstName lastName email }
    }
  }
`;

const CREATE_FIXED_ASSET = gql`
  mutation CreateFixedAsset(
    $acquisitionDate: String!
    $category: FixedAssetCategoryEnum!
    $name: String!
    $status: FixedAssetStatusEnum!
    $description: String
    $imageUrl: String
    $location: String!
  ) {
    createFixedAsset(
      acquisitionDate: $acquisitionDate
      category: $category
      name: $name
      status: $status
      description: $description
      imageUrl: $imageUrl
      location: $location
    ) {
      id name description category location status imageUrl acquisitionDate user { firstName lastName email }
    }
  }
`;

const CREATE_FIXED_ASSET_WITH_USER = gql`
  mutation CreateFixedAssetWithUser(
    $acquisitionDate: String!
    $category: FixedAssetCategoryEnum!
    $name: String!
    $status: FixedAssetStatusEnum!
    $description: String
    $imageUrl: String
    $location: String!
    $userId: ID!
  ) {
    createFixedAssetWithUser(
      acquisitionDate: $acquisitionDate
      category: $category
      name: $name
      status: $status
      description: $description
      imageUrl: $imageUrl
      location: $location
      userId: $userId
    ) {
      id name description category location status imageUrl acquisitionDate user { firstName lastName email }
    }
  }
`;

const UPDATE_FIXED_ASSET = gql`
  mutation UpdateFixedAsset(
    $id: ID!
    $acquisitionDate: String
    $category: FixedAssetCategoryEnum
    $description: String
    $imageUrl: String
    $location: String
    $name: String
    $status: FixedAssetStatusEnum
  ) {
    updateFixedAsset(
      id: $id
      acquisitionDate: $acquisitionDate
      category: $category
      description: $description
      imageUrl: $imageUrl
      location: $location
      name: $name
      status: $status
    ) {
      id name description category location status imageUrl acquisitionDate user { firstName lastName email }
    }
  }
`;

const DELETE_FIXED_ASSET = gql`
  mutation DeleteFixedAsset($id: ID!) {
    deleteFixedAsset(id: $id)
  }
`;

const ASSIGN_FIXED_ASSET_TO_USER = gql`
  mutation AssignFixedAssetToUser($fixedAssetId: ID!, $userId: ID!) {
    assignFixedAssetToUser(fixedAssetId: $fixedAssetId, userId: $userId) {
      id
    }
  }
`;

@Injectable()
export class ActivoRepositoryImpl extends ActivoRepository {
  private readonly apollo = inject(Apollo);
  private readonly http = inject(HttpClient);

  list(filters: ListActivosFilters): Observable<PaginatedActivosResult> {
    return this.apollo
      .query<{ getAllFixedAssets: PaginatedActivosDtoResult }>({
        query: GET_ALL_FIXED_ASSETS,
        variables: { offset: filters.offset, limit: filters.limit },
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => toPaginatedResult(result.data!.getAllFixedAssets)));
  }

  getById(id: string): Observable<Activo> {
    return this.apollo
      .query<{ getFixedAssetById: ActivoDto }>({
        query: GET_FIXED_ASSET_BY_ID,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => toActivo(result.data!.getFixedAssetById)));
  }

  create(input: CreateActivoInput): Observable<Activo> {
    const graphqlVars = {
      acquisitionDate: input.acquisitionDate,
      category: input.category,
      name: input.name,
      status: input.status,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      location: input.location,
    };

    const restDto: CreateActivoRestDto = {
      codigo: input.codigo,
      nombre: input.name,
      descripcion: input.description,
      categoria: input.category,
      ubicacion: input.location,
      estado: input.status,
      marca: input.marca,
      modelo: input.modelo,
      fecha_adquisicion: input.acquisitionDate,
      ...(input.imageUrl ? { imagen_url: input.imageUrl } : {}),
      ...(input.numeroSerie ? { numero_serie: input.numeroSerie } : {}),
      ...(input.valorAdquisicion != null ? { valor_adquisicion: input.valorAdquisicion } : {}),
      ...(input.tags?.length ? { tags: input.tags } : {}),
    };

    const graphql$ = input.userId
      ? this.apollo
          .mutate<{ createFixedAssetWithUser: ActivoDto }>({
            mutation: CREATE_FIXED_ASSET_WITH_USER,
            variables: { ...graphqlVars, userId: input.userId },
          })
          .pipe(map((result) => toActivo(result.data!.createFixedAssetWithUser)))
      : this.apollo
          .mutate<{ createFixedAsset: ActivoDto }>({ mutation: CREATE_FIXED_ASSET, variables: graphqlVars })
          .pipe(map((result) => toActivo(result.data!.createFixedAsset)));

    const rest$ = this.http.post<CreateActivoRestResponseDto>(`${REST_BASE_URL}/assets`, restDto);

    return forkJoin([graphql$, rest$]).pipe(map(([activo]) => activo));
  }

  update(id: string, input: UpdateActivoInput): Observable<Activo> {
    return this.apollo
      .mutate<{ updateFixedAsset: ActivoDto }>({
        mutation: UPDATE_FIXED_ASSET,
        variables: {
          id,
          acquisitionDate: input.acquisitionDate || null,
          category: input.category || null,
          description: input.description || null,
          imageUrl: input.imageUrl || null,
          location: input.location || null,
          name: input.name || null,
          status: input.status || null,
        },
      })
      .pipe(map((result) => toActivo(result.data!.updateFixedAsset)));
  }

  remove(id: string): Observable<void> {
    return this.apollo
      .mutate({ mutation: DELETE_FIXED_ASSET, variables: { id } })
      .pipe(map(() => undefined));
  }

  assignUser(fixedAssetId: string, userId: string): Observable<void> {
    return this.apollo
      .mutate({ mutation: ASSIGN_FIXED_ASSET_TO_USER, variables: { fixedAssetId, userId } })
      .pipe(map(() => undefined));
  }
}
