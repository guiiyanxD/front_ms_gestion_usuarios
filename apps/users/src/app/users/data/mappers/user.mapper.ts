import { UserDto, RoleDto } from '../dto/user.dto';
import { User, RoleOption } from '../../domain/models/user.model';

export function toUser(dto: UserDto): User {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    enabled: dto.enabled,
    roleId: dto.role?.id ?? '',
    roleName: dto.role?.name ?? '—',
    createdAt: dto.createdAt,
  };
}

export function toRoleOption(dto: RoleDto): RoleOption {
  return { id: dto.id, name: dto.name };
}
