import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activo, ActivoCategory, ActivoStatus, CreateActivoInput, UpdateActivoInput } from '../../../domain/models/activo.model';

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

  readonly tags = signal<string[]>([]);
  readonly tagInput = new FormControl('', { nonNullable: true });

  addTag(): void {
    const value = this.tagInput.value.trim();
    if (!value || this.tags().includes(value)) return;
    this.tags.update(t => [...t, value]);
    this.tagInput.reset();
  }

  removeTag(tag: string): void {
    this.tags.update(t => t.filter(t => t !== tag));
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') { event.preventDefault(); this.addTag(); }
  }

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
    codigo: [''],
    marca: [''],
    modelo: [''],
    numeroSerie: [''],
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
        this.form.controls.codigo.clearValidators();
        this.form.controls.marca.clearValidators();
        this.form.controls.modelo.clearValidators();
      } else {
        this.form.reset({ category: 'ELECTRONIC_EQUIPMENT', status: 'ACTIVE' });
        this.tags.set([]);
        this.tagInput.reset();
        this.form.controls.codigo.setValidators([Validators.required]);
        this.form.controls.marca.setValidators([Validators.required]);
        this.form.controls.modelo.setValidators([Validators.required]);
      }
      this.form.controls.codigo.updateValueAndValidity();
      this.form.controls.marca.updateValueAndValidity();
      this.form.controls.modelo.updateValueAndValidity();
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
        codigo: v.codigo,
        marca: v.marca,
        modelo: v.modelo,
        ...(v.userId.trim() ? { userId: v.userId.trim() } : {}),
        ...(v.numeroSerie?.trim() ? { numeroSerie: v.numeroSerie.trim() } : {}),
        ...(v.valorAdquisicion != null ? { valorAdquisicion: v.valorAdquisicion } : {}),
        ...(this.tags().length ? { tags: this.tags() } : {}),
      };
      this.submitted.emit(input);
    }
  }
}
