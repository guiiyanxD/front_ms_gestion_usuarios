import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActividadesStore } from '../state/actividades.store';
import { ActividadTableComponent } from './ui/actividad-table/actividad-table.component';

@Component({
  selector: 'app-actividades-page',
  standalone: true,
  imports: [ActividadTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './actividades.page.html',
  styleUrl: './actividades.page.css',
})
export class ActividadesPage implements OnInit {
  private readonly store = inject(ActividadesStore);

  readonly actividades = this.store.actividades;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly currentPage = this.store.currentPage;
  readonly totalPages = this.store.totalPages;
  readonly totalElements = this.store.totalElements;
  readonly hasNext = this.store.hasNext;
  readonly hasPrevious = this.store.hasPrevious;

  ngOnInit(): void {
    this.store.load();
  }

  onNextPage(): void { this.store.nextPage(); }
  onPrevPage(): void { this.store.prevPage(); }
}
