import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from './ui/profile-card/profile-card.component';
import { ProfileStore } from '../state/profile.store';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
})
export class ProfilePage implements OnInit {
  private readonly store = inject(ProfileStore);

  readonly profile = this.store.profile;
  readonly status = this.store.status;
  readonly error = this.store.error;

  ngOnInit(): void {
    this.store.load();
  }
}