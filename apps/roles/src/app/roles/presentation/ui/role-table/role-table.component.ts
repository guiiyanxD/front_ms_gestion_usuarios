import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Role } from '../../../domain/models/role.model';

@Component({
  selector: 'app-role-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-table.component.html',
  styleUrl: './role-table.component.css',
})
export class RoleTableComponent {
  readonly roles = input.required<Role[]>();
  readonly edit = output<Role>();
  readonly remove = output<Role>();
}