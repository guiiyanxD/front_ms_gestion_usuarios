import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivosStore } from '../state/activos.store';

@Component({
  selector: 'app-activo-detail-page',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activo-detail.page.html',
  styleUrl: './activo-detail.page.css',
})
export class ActivoDetailPage implements OnInit {
  private readonly store = inject(ActivosStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activo = this.store.selected;
  readonly status = this.store.status;
  readonly error = this.store.error;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.loadOne(id);
  }

  onBack(): void {
    this.router.navigate(['activos-fijos']);
  }
}
