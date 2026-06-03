import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ActivoTableComponent } from './ui/activo-table/activo-table.component';
import { ActivoFormComponent } from './ui/activo-form/activo-form.component';
import { ActivosStore } from '../state/activos.store';
import { ActivoSummary, CreateActivoInput } from '../domain/models/activo.model';

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

  readonly showForm = signal(false);

  ngOnInit(): void {
    this.store.load();
  }

  onNew(): void { this.showForm.set(true); }
  onCancel(): void { this.showForm.set(false); }

  onSubmit(input: CreateActivoInput): void {
    this.store.create(input);
    this.showForm.set(false);
  }

  onView(activo: ActivoSummary): void {
    this.router.navigate(['activos-fijos', activo.id]);
  }
}
