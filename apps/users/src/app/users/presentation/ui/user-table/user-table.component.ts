import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '../../../domain/models/user.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css',
})
export class UserTableComponent {
  readonly users = input.required<User[]>();
  readonly edit = output<User>();
  readonly remove = output<User>();
}