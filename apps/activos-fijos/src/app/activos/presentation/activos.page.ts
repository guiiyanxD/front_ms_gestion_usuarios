import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ActivoTableComponent } from './ui/activo-table/activo-table.component';
import { ActivoFormComponent } from './ui/activo-form/activo-form.component';
import { ActivosStore } from '../state/activos.store';
import { Activo, ActivoSummary, CreateActivoInput, UpdateActivoInput } from '../domain/models/activo.model';

@Component({
  selector: 'app-activos-page',
  standalone: true,
  imports: [ActivoTableComponent, ActivoFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activos.page.html',
  styleUrl: './activos.page.css',
})
export class ActivosPage implements OnInit {
  private readonly store = inject(ActivosStore);
  private readonly router = inject(Router);

  readonly activos = this.store.activos;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly isSaving = this.store.isSaving;
  readonly currentPage = this.store.currentPage;
  readonly totalPages = this.store.totalPages;
  readonly totalElements = this.store.totalElements;
  readonly hasNext = this.store.hasNext;
  readonly hasPrevious = this.store.hasPrevious;
  readonly userOptions = this.store.userOptions;

  readonly showForm = signal(false);
  readonly editingActivo = signal<Activo | null>(null);

  constructor() {
    effect(() => {
      const target = this.store.editTarget();
      if (target) {
        this.editingActivo.set(target);
        this.showForm.set(true);
      }
    });
  }

  ngOnInit(): void {
    this.store.load();
    this.store.loadUserOptions();
  }

  onNew(): void {
    this.store.clearEditTarget();
    this.editingActivo.set(null);
    this.showForm.set(true);
  }

  onEdit(summary: ActivoSummary): void {
    this.store.loadForEdit(summary.id);
  }

  onCancel(): void {
    this.showForm.set(false);
    this.editingActivo.set(null);
    this.store.clearEditTarget();
  }

  onSubmit(input: CreateActivoInput | UpdateActivoInput): void {
    const current = this.editingActivo();
    if (current) {
      this.store.update(current.id, input as UpdateActivoInput);
    } else {
      this.store.create(input as CreateActivoInput);
    }
    this.showForm.set(false);
    this.editingActivo.set(null);
    this.store.clearEditTarget();
  }

  onDelete(activo: ActivoSummary): void {
    if (confirm(`¿Eliminar el activo "${activo.name}"?`)) {
      this.store.remove(activo.id);
    }
  }

  onView(activo: ActivoSummary): void {
    this.router.navigate(['activos-fijos', activo.id]);
  }

  onNextPage(): void { this.store.nextPage(); }
  onPrevPage(): void { this.store.prevPage(); }
}
