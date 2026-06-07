import { RoleDto } from '../dto/role.dto';
import { Role } from '../../domain/models/role.model';

export function toRole(dto: RoleDto): Role {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    createdAt: dto.createdAt,
  };
}