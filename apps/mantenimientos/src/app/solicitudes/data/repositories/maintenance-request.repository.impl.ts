import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { MaintenanceRequestRepository } from '../../domain/repositories/maintenance-request.repository';
import {
  MaintenanceRequest, MaintenanceRequestStatus, PaginatedRequestsResult,
  ListRequestsFilters, CreateMaintenanceRequestInput, UpdateStatusInput,
} from '../../domain/models/maintenance-request.model';
import {
  MaintenanceRequestDto, PaginatedRequestsDtoResult,
  CreateMaintenanceRequestRestDto, UpdateStatusRestDto,
} from '../dto/maintenance-request.dto';
import { toMaintenanceRequest, toPaginatedRequests } from '../mappers/maintenance-request.mapper';

const REST_BASE = 'https://ms-bi-automation.onrender.com/api/v1';

const GET_ALL_REQUESTS = gql`
  query GetAllMaintenanceRequests($offset: Int!, $limit: Int!) {
    getAllMaintenancesRequests(offset: $offset, limit: $limit) {
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

  list(filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    return this.apollo
      .query<{ getAllMaintenancesRequests: PaginatedRequestsDtoResult }>({
        query: GET_ALL_REQUESTS,
        variables: { offset: filters.offset, limit: filters.limit },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => toPaginatedRequests(r.data!.getAllMaintenancesRequests)));
  }

  listByStatus(status: MaintenanceRequestStatus, filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    return this.apollo
      .query<{ getMaintenanceRequestsByStatus: PaginatedRequestsDtoResult }>({
        query: GET_REQUESTS_BY_STATUS,
        variables: { status, offset: filters.offset, limit: filters.limit },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => toPaginatedRequests(r.data!.getMaintenanceRequestsByStatus)));
  }

  listByCreatedBy(createdBy: string, filters: ListRequestsFilters): Observable<PaginatedRequestsResult> {
    return this.apollo
      .query<{ getMaintenanceRequestsByCreatedBy: PaginatedRequestsDtoResult }>({
        query: GET_REQUESTS_BY_CREATED_BY,
        variables: { createdBy, offset: filters.offset, limit: filters.limit },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => toPaginatedRequests(r.data!.getMaintenanceRequestsByCreatedBy)));
  }

  getById(id: string): Observable<MaintenanceRequest> {
    return this.apollo
      .query<{ getMaintenanceRequestById: MaintenanceRequestDto }>({
        query: GET_REQUEST_BY_ID,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => toMaintenanceRequest(r.data!.getMaintenanceRequestById)));
  }

  create(input: CreateMaintenanceRequestInput, solicitanteId: string): Observable<MaintenanceRequest> {
    const graphql$ = this.apollo
      .mutate<{ createMaintenanceRequest: MaintenanceRequestDto }>({
        mutation: CREATE_MAINTENANCE_REQUEST,
        variables: { fixedAssetId: input.fixedAssetId, title: input.title, description: input.description },
      })
      .pipe(map((r) => toMaintenanceRequest(r.data!.createMaintenanceRequest)));

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
    const rest$ = this.http.post(`${REST_BASE}/solicitudes`, restDto);

    return forkJoin([graphql$, rest$]).pipe(map(([request]) => request));
  }

  updateStatus(id: string, input: UpdateStatusInput): Observable<void> {
    const graphqlStatus = input.newStatus;

    const graphql$ = this.apollo.mutate({
      mutation: UPDATE_MAINTENANCE_REQUEST_STATUS,
      variables: { id, newStatus: graphqlStatus },
    });

    let restDto: UpdateStatusRestDto;
    if (input.newStatus === 'APPROVED') {
      restDto = { estado: 'EN_PROCESO', tecnico_id: input.technicianId, diagnostico: input.diagnostico };
    } else if (input.newStatus === 'COMPLETED') {
      restDto = { estado: 'COMPLETADO', solucion: input.solucion, costo: input.costo };
    } else {
      restDto = { estado: 'RECHAZADO', diagnostico: input.diagnostico };
    }

    const rest$ = this.http.patch(`${REST_BASE}/solicitudes/${id}/estado`, restDto);

    return forkJoin([graphql$, rest$]).pipe(map(() => undefined));
  }

  update(id: string, title: string, description: string): Observable<MaintenanceRequest> {
    return this.apollo
      .mutate<{ updateMaintenanceRequest: MaintenanceRequestDto }>({
        mutation: UPDATE_MAINTENANCE_REQUEST,
        variables: { id, title, description },
      })
      .pipe(map((r) => toMaintenanceRequest(r.data!.updateMaintenanceRequest)));
  }

  remove(id: string): Observable<void> {
    return this.apollo
      .mutate({ mutation: DELETE_MAINTENANCE_REQUEST, variables: { id } })
      .pipe(map(() => undefined));
  }
}
