import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Profile } from '../../../domain/models/profile.model';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css',
})
export class ProfileCardComponent {
  readonly profile = input.required<Profile>();
}