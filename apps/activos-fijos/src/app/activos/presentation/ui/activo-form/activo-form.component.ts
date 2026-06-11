import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activo, ActivoCategory, ActivoStatus, CreateActivoInput, UpdateActivoInput } from '../../../domain/models/activo.model';
import { UserOption } from '../../../domain/models/user-option.model';

@Component({
  selector: 'app-activo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activo-form.component.html',
  styleUrl: './activo-form.component.css',
})
export class ActivoFormComponent {
  readonly editing = input<Activo | null>(null);
  readonly saving = input<boolean>(false);
  readonly userOptions = input<UserOption[]>([]);
  readonly submitted = output<CreateActivoInput | UpdateActivoInput>();
  readonly cancelled = output<void>();

  readonly categories: ActivoCategory[] = [
    'ELECTRONIC_EQUIPMENT', 'HVAC_EQUIPMENT', 'FIXTURES', 'OTHERS',
  ];
  readonly statuses: ActivoStatus[] = [
    'ACTIVE', 'IN_STORAGE', 'UNDER_MAINTENANCE', 'DAMAGED', 'RETIRED', 'LOST',
  ];
  readonly categoryLabels: Record<ActivoCategory, string> = {
    ELECTRONIC_EQUIPMENT: 'Equipo electrónico',
    HVAC_EQUIPMENT: 'Equipo HVAC',
    FIXTURES: 'Instalaciones',
    OTHERS: 'Otros',
  };
  readonly statusLabels: Record<ActivoStatus, string> = {
    ACTIVE: 'Activo',
    IN_STORAGE: 'En almacén',
    UNDER_MAINTENANCE: 'En mantenimiento',
    DAMAGED: 'Dañado',
    RETIRED: 'Retirado',
    LOST: 'Perdido',
  };

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    category: ['ELECTRONIC_EQUIPMENT' as ActivoCategory, [Validators.required]],
    location: ['', [Validators.required]],
    status: ['ACTIVE' as ActivoStatus, [Validators.required]],
    imageUrl: [''],
    acquisitionDate: ['', [Validators.required]],
    userId: [''],
    marca: [''],
    modelo: [''],
    valorAdquisicion: [null as number | null],
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (e) {
        this.form.patchValue({
          name: e.name,
          description: e.description,
          category: e.category,
          location: e.location,
          status: e.status,
          imageUrl: e.imageUrl,
          acquisitionDate: e.acquisitionDate,
        });
      } else {
        this.form.reset({ category: 'ELECTRONIC_EQUIPMENT', status: 'ACTIVE' });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    if (this.editing()) {
      this.submitted.emit({
        name: v.name,
        description: v.description,
        category: v.category,
        location: v.location,
        status: v.status,
        imageUrl: v.imageUrl,
        acquisitionDate: v.acquisitionDate,
      } as UpdateActivoInput);
    } else {
      const input: CreateActivoInput = {
        name: v.name,
        description: v.description,
        category: v.category,
        location: v.location,
        status: v.status,
        imageUrl: v.imageUrl,
        acquisitionDate: v.acquisitionDate,
        ...(v.userId.trim() ? { userId: v.userId.trim() } : {}),
      };
      this.submitted.emit(input);
    }
  }
}
