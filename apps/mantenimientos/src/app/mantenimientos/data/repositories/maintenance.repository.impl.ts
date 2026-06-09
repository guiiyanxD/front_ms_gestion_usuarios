import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { MaintenanceRepository } from '../../domain/repositories/maintenance.repository';
import { Maintenance, CreateMaintenanceInput, UpdateMaintenanceInput } from '../../domain/models/maintenance.model';
import { MaintenanceDto } from '../dto/maintenance.dto';
import { toMaintenance } from '../mappers/maintenance.mapper';

const GET_MAINTENANCES_BY_USER = gql`
  query GetMaintenancesByUser($userId: ID!) {
    getMaintenanceByUser(userId: $userId) {
      id type description imageUrl
      maintenanceRequest { id title description status
        fixedAsset { id name category description }
      }
    }
  }
`;

const GET_MAINTENANCES_BY_REQUEST = gql`
  query GetMaintenancesByRequest($maintenanceRequestId: ID!) {
    getMaintenancesByMaintenanceRequest(maintenanceRequestId: $maintenanceRequestId) {
      id type description imageUrl
      maintenanceRequest { id title description status
        fixedAsset { id name category description }
      }
    }
  }
`;

const GET_MAINTENANCE_BY_ID = gql`
  query GetMaintenanceById($id: ID!) {
    getMaintenancesById(id: $id) {
      id type description imageUrl
      maintenanceRequest { id title description status
        fixedAsset { id name category description }
      }
    }
  }
`;

const CREATE_MAINTENANCE = gql`
  mutation CreateMaintenance(
    $maintenanceRequestId: ID!
    $type: MaintenanceTypeEnum!
    $description: String!
    $userId: ID!
    $imageUrl: String
  ) {
    createMaintenance(
      maintenanceRequestId: $maintenanceRequestId
      type: $type
      description: $description
      userId: $userId
      imageUrl: $imageUrl
    ) {
      id type description
      maintenanceRequest { id title description status
        fixedAsset { id name category description }
      }
    }
  }
`;

const UPDATE_MAINTENANCE = gql`
  mutation UpdateMaintenance($id: ID!, $type: MaintenanceTypeEnum, $description: String, $imageUrl: String) {
    updateMaintenance(id: $id, type: $type, description: $description, imageUrl: $imageUrl) {
      id type description imageUrl
      maintenanceRequest { id title description status
        fixedAsset { id name category description }
      }
    }
  }
`;

const DELETE_MAINTENANCE = gql`
  mutation DeleteMaintenance($id: ID!) {
    deleteMaintenance(id: $id)
  }
`;

@Injectable()
export class MaintenanceRepositoryImpl extends MaintenanceRepository {
  private readonly apollo = inject(Apollo);

  listByUser(userId: string): Observable<Maintenance[]> {
    return this.apollo
      .query<{ getMaintenanceByUser: MaintenanceDto[] }>({
        query: GET_MAINTENANCES_BY_USER,
        variables: { userId },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.getMaintenanceByUser.map(toMaintenance)));
  }

  listByRequest(requestId: string): Observable<Maintenance[]> {
    return this.apollo
      .query<{ getMaintenancesByMaintenanceRequest: MaintenanceDto[] }>({
        query: GET_MAINTENANCES_BY_REQUEST,
        variables: { maintenanceRequestId: requestId },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.getMaintenancesByMaintenanceRequest.map(toMaintenance)));
  }

  getById(id: string): Observable<Maintenance> {
    return this.apollo
      .query<{ getMaintenancesById: MaintenanceDto }>({
        query: GET_MAINTENANCE_BY_ID,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => toMaintenance(r.data!.getMaintenancesById)));
  }

  create(input: CreateMaintenanceInput): Observable<Maintenance> {
    return this.apollo
      .mutate<{ createMaintenance: MaintenanceDto }>({
        mutation: CREATE_MAINTENANCE,
        variables: {
          maintenanceRequestId: input.maintenanceRequestId,
          type: input.type,
          description: input.description,
          userId: input.userId,
          imageUrl: input.imageUrl ?? null,
        },
      })
      .pipe(map((r) => toMaintenance(r.data!.createMaintenance)));
  }

  update(id: string, input: UpdateMaintenanceInput): Observable<Maintenance> {
    return this.apollo
      .mutate<{ updateMaintenance: MaintenanceDto }>({
        mutation: UPDATE_MAINTENANCE,
        variables: {
          id,
          type: input.type ?? null,
          description: input.description ?? null,
          imageUrl: input.imageUrl ?? null,
        },
      })
      .pipe(map((r) => toMaintenance(r.data!.updateMaintenance)));
  }

  remove(id: string): Observable<void> {
    return this.apollo
      .mutate({ mutation: DELETE_MAINTENANCE, variables: { id } })
      .pipe(map(() => undefined));
  }
}
