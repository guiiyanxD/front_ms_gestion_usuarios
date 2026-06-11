import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { MaintenanceRequestRepository } from '../../domain/repositories/maintenance-request.repository';
import {
  MaintenanceRequest, MaintenanceRequestStatus, PaginatedRequestsResult,
  ListRequestsFilters, CreateMaintenanceRequestInput, UpdateStatusInput,
} from '../../domain/models/maintenance-request.model';
import {
  MaintenanceRequestDto, PaginatedRequestsDtoResult,
  CreateMaintenanceRequestRestDto, UpdateStatusRestDto, DiagnosticoRestDto,
  SolicitudesRestResponseDto, SolicitudRestDetailResponseDto,
} from '../dto/maintenance-request.dto';
import { toMaintenanceRequest, toMaintenanceRequestFromRest, toPaginatedRequests, toPaginatedRequestsFromRest } from '../mappers/maintenance-request.mapper';
import { environment } from '../../../../environments/environment';

const STATUS_TO_ESTADO: Record<MaintenanceRequestStatus, string> = {
  PENDING: 'PENDIENTE',
  APPROVED: 'EN_PROCESO',
  COMPLETED: 'COMPLETADO',
};

const REST_BASE = environment.restBaseUrl;

const GET_ALL_REQUESTS = gql`
  query GetAllMaintenanceRequests($offset: Int!, $limit: Int!) {
    getAllMaintenanceRequests(offset: $offset, limit: $limit) {
      content { id title description status createdBy createdAt updatedAt
        fixedAsset { id name category location status }
        statusChangeLog { fromStatus toStatus }
      }
      currentPage totalPages totalElements hasNext hasPrevious
    }
  }
`;

const GET_REQUESTS_BY_STATUS = gql`
  query GetMaintenanceRequestsByStatus($status: MaintenanceRequestStatusEnum!, $offset: Int!, $limit: Int!) {
    getMaintenanceRequestsByStatus(status: $status, offset: $offset, limit: $limit) {
      content { id title description status createdBy createdAt updatedAt
        fixedAsset { id name category location status }
        statusChangeLog { fromStatus toStatus }
      }
      currentPage totalPages totalElements hasNext hasPrevious
    }
  }
`;

const GET_REQUESTS_BY_CREATED_BY = gql`
  query GetMaintenanceRequestsByCreatedBy($createdBy: String!, $offset: Int!, $limit: Int!) {
    getMaintenanceRequestsByCreatedBy(createdBy: $createdBy, offset: $offset, limit: $limit) {
      content { id title description status createdBy createdAt updatedAt
        fixedAsset { id name category location status }
        statusChangeLog { fromStatus toStatus }
      }
      currentPage totalPages totalElements hasNext hasPrevious
    }
  }
`;

const GET_REQUEST_BY_ID = gql`
  query GetMaintenanceRequestById($id: ID!) {
    getMaintenanceRequestById(id: $id) {
      id title description status createdBy createdAt updatedAt
      fixedAsset { id name category location status }
      statusChangeLog { fromStatus toStatus }
    }
  }
`;

const CREATE_MAINTENANCE_REQUEST = gql`
  mutation CreateMaintenanceRequest($fixedAssetId: ID!, $title: String!, $description: String!) {
    createMaintenanceRequest(fixedAssetId: $fixedAssetId, title: $title, description: $description) {
      id title description status createdBy createdAt
      fixedAsset { id name category location status }
      statusChangeLog { fromStatus toStatus }
    }
  }
`;

const UPDATE_MAINTENANCE_REQUEST_STATUS = gql`
  mutation UpdateMaintenanceRequestStatus($id: ID!, $newStatus: MaintenanceRequestStatusEnum!) {
    updateMaintenanceRequestStatus(id: $id, newStatus: $newStatus) {
      id status
    }
  }
`;

const UPDATE_MAINTENANCE_REQUEST = gql`
  mutation UpdateMaintenanceRequest($id: ID!, $title: String, $description: String) {
    updateMaintenanceRequest(id: $id, title: $title, description: $description) {
      id title description status createdBy createdAt updatedAt
      fixedAsset { id name category location status }
      statusChangeLog { fromStatus toStatus }
    }
  }
`;

const DELETE_MAINTENANCE_REQUEST = gql`
  mutation DeleteMaintenanceRequest($id: ID!) {
    deleteMaintenanceRequest(id: $id)
  }
`;

@Injectable()
export class MaintenanceRequestRepositoryImpl extends MaintenanceRequestRepository {
  private readonly apollo = inject(Apollo);
  private readonly http = inject(HttpClient);

  private toPage(filters: ListRequestsFilters): number {
    return Math.floor(filters.offset / filters.limit) + 1;
  }

  private buildParams(filters: ListRequestsFilters): URLSearchParams {
    const p = new URLSearchParams({
      page: String(this.toPage(filters)),
      pageSize: String(filters.limit),
    });
    if (filters.codigo?.trim()) p.set('codigo', filters.codigo.trim());
    if (filters.prioridad) p.set('prioridad', filters.prioridad);
    if (filters.status) p.set('estado', STATUS_TO_ESTADO[filters.status]);
    return p;
  }

  list(filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    return this.http
      .get<SolicitudesRestResponseDto>(`${REST_BASE}/solicitudes?${this.buildParams(filters)}`)
      .pipe(map(toPaginatedRequestsFromRest));

    // [GraphQL - comentado]
    // return this.apollo
    //   .query<{ getAllMaintenanceRequests: PaginatedRequestsDtoResult }>({
    //     query: GET_ALL_REQUESTS,
    //     variables: { offset: filters.offset, limit: filters.limit },
    //     fetchPolicy: 'network-only',
    //   })
    //   .pipe(map((r) => toPaginatedRequests(r.data!.getAllMaintenanceRequests)));
  }

  listByStatus(status: MaintenanceRequestStatus, filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    const params = this.buildParams(filters);
    // estado forzado por el rol; sobrescribe cualquier status que venga en filters
    params.set('estado', STATUS_TO_ESTADO[status]);
    return this.http
      .get<SolicitudesRestResponseDto>(`${REST_BASE}/solicitudes?${params}`)
      .pipe(map(toPaginatedRequestsFromRest));

    // [GraphQL - comentado]
    // return this.apollo
    //   .query<{ getMaintenanceRequestsByStatus: PaginatedRequestsDtoResult }>({
    //     query: GET_REQUESTS_BY_STATUS,
    //     variables: { status, offset: filters.offset, limit: filters.limit },
    //     fetchPolicy: 'network-only',
    //   })
    //   .pipe(map((r) => toPaginatedRequests(r.data!.getMaintenanceRequestsByStatus)));
  }

  listByTechnician(tecnicoId: string, filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    const params = this.buildParams(filters);
    params.set('tecnicoId', tecnicoId);
    return this.http
      .get<SolicitudesRestResponseDto>(`${REST_BASE}/solicitudes?${params}`)
      .pipe(map(toPaginatedRequestsFromRest));
  }

  listByCreatedBy(solicitanteId: string, filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    const params = this.buildParams(filters);
    params.set('solicitante_id', solicitanteId);
    return this.http
      .get<SolicitudesRestResponseDto>(`${REST_BASE}/solicitudes?${params}`)
      .pipe(map(toPaginatedRequestsFromRest));

    // [GraphQL - comentado]
    // return this.apollo
    //   .query<{ getMaintenanceRequestsByCreatedBy: PaginatedRequestsDtoResult }>({
    //     query: GET_REQUESTS_BY_CREATED_BY,
    //     variables: { createdBy: solicitanteId, offset: filters.offset, limit: filters.limit },
    //     fetchPolicy: 'network-only',
    //   })
    //   .pipe(map((r) => toPaginatedRequests(r.data!.getMaintenanceRequestsByCreatedBy)));
  }

  getById(id: string): Observable<MaintenanceRequest> {
    return this.http
      .get<SolicitudRestDetailResponseDto>(`${REST_BASE}/solicitudes/${id}`)
      .pipe(map((r) => toMaintenanceRequestFromRest(r.data)));

    // [GraphQL - comentado]
    // return this.apollo
    //   .query<{ getMaintenanceRequestById: MaintenanceRequestDto }>({
    //     query: GET_REQUEST_BY_ID,
    //     variables: { id: _id },
    //     fetchPolicy: 'network-only',
    //   })
    //   .pipe(map((r) => toMaintenanceRequest(r.data!.getMaintenanceRequestById)));
  }

  create(input: CreateMaintenanceRequestInput, solicitanteId: string): Observable<MaintenanceRequest> {
    const restDto: CreateMaintenanceRequestRestDto = {
      solicitante_id: solicitanteId,
      activo_id: input.fixedAssetId,
      area_id: input.areaId,
      tipo: input.tipo,
      prioridad: input.prioridad,
      descripcion: input.description,
      canal_origen: 'WEB',
      metadata: {},
    };
    return this.http
      .post<MaintenanceRequest>(`${REST_BASE}/solicitudes`, restDto)
      .pipe(map(() => null as unknown as MaintenanceRequest));

    // [GraphQL - comentado]
    // const graphql$ = this.apollo
    //   .mutate<{ createMaintenanceRequest: MaintenanceRequestDto }>({
    //     mutation: CREATE_MAINTENANCE_REQUEST,
    //     variables: { fixedAssetId: input.fixedAssetId, title: input.title, description: input.description },
    //   })
    //   .pipe(map((r) => toMaintenanceRequest(r.data!.createMaintenanceRequest)));
    // const rest$ = this.http.post(`${REST_BASE}/solicitudes`, restDto);
    // return forkJoin([graphql$, rest$]).pipe(map(([request]) => request));
  }

  updateStatus(id: string, input: UpdateStatusInput): Observable<void> {
    const restDto: UpdateStatusRestDto = input.newStatus === 'APPROVED'
      ? { estado: 'EN_PROCESO', tecnico_id: input.technicianId }
      : { estado: 'COMPLETADO', solucion: input.solucion, costo: input.costo };
    return this.http.patch(`${REST_BASE}/solicitudes/${id}/estado`, restDto).pipe(map(() => undefined));

    // [GraphQL - comentado]
    // const graphql$ = this.apollo.mutate({
    //   mutation: UPDATE_MAINTENANCE_REQUEST_STATUS,
    //   variables: { id, newStatus: input.newStatus },
    // });
    // const rest$ = this.http.patch(`${REST_BASE}/solicitudes/${id}/estado`, restDto);
    // return forkJoin([graphql$, rest$]).pipe(map(() => undefined));
  }

  updateDiagnostico(id: string, diagnostico: string): Observable<void> {
    const dto: DiagnosticoRestDto = { estado: 'EN_PROCESO', diagnostico };
    return this.http.patch(`${REST_BASE}/solicitudes/${id}/estado`, dto).pipe(map(() => undefined));
  }

  update(_id: string, _title: string, _description: string): Observable<MaintenanceRequest> {
    // [GraphQL - comentado] sin endpoint REST alternativo
    // return this.apollo
    //   .mutate<{ updateMaintenanceRequest: MaintenanceRequestDto }>({
    //     mutation: UPDATE_MAINTENANCE_REQUEST,
    //     variables: { id: _id, title: _title, description: _description },
    //   })
    //   .pipe(map((r) => toMaintenanceRequest(r.data!.updateMaintenanceRequest)));
    return of(null as unknown as MaintenanceRequest);
  }

  remove(_id: string): Observable<void> {
    // [GraphQL - comentado] sin endpoint REST alternativo
    // return this.apollo
    //   .mutate({ mutation: DELETE_MAINTENANCE_REQUEST, variables: { id: _id } })
    //   .pipe(map(() => undefined));
    return of(undefined);
  }
}
