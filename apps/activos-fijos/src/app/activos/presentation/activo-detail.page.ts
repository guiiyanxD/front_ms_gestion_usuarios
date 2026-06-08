import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivosStore } from '../state/activos.store';
import { ActivoCategory, ActivoStatus } from '../domain/models/activo.model';

const CATEGORY_LABELS: Record<ActivoCategory, string> = {
  ELECTRONIC_EQUIPMENT: 'Equipo electrónico',
  HVAC_EQUIPMENT: 'Equipo HVAC',
  FIXTURES: 'Instalaciones',
  OTHERS: 'Otros',
};

const STATUS_LABELS: Record<ActivoStatus, string> = {
  ACTIVE: 'Activo',
  IN_STORAGE: 'En almacén',
  UNDER_MAINTENANCE: 'En mantenimiento',
  DAMAGED: 'Dañado',
  RETIRED: 'Retirado',
  LOST: 'Perdido',
};

@Component({
  selector: 'app-activo-detail-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activo-detail.page.html',
  styleUrl: './activo-detail.page.css',
})
export class ActivoDetailPage implements OnInit {
  private readonly store = inject(ActivosStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = new FormBuilder();

  readonly activo = this.store.selected;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly showAssignForm = signal(false);

  readonly assignForm = this.fb.nonNullable.group({
    userId: ['', [Validators.required]],
  });

  readonly categoryLabels = CATEGORY_LABELS;
  readonly statusLabels = STATUS_LABELS;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.loadOne(id);
  }

  onBack(): void {
    this.router.navigate(['activos-fijos']);
  }

  onAssign(): void {
    if (this.assignForm.invalid) { this.assignForm.markAllAsTouched(); return; }
    const a = this.activo();
    if (!a) return;
    this.store.assignUser(a.id, this.assignForm.getRawValue().userId.trim());
    this.showAssignForm.set(false);
    this.assignForm.reset();
  }
}
