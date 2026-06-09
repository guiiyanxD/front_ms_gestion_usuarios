import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DashboardStore } from '../state/dashboard.store';
import { KpiCardComponent } from './ui/kpi-card/kpi-card.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [KpiCardComponent, DecimalPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit {
  readonly store = inject(DashboardStore);

  ngOnInit(): void {
    this.store.load();
  }
}
