import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateActivoInput, EstadoActivo } from '../../../domain/models/activo.model';

@Component({
  selector: 'app-activo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activo-form.component.html',
  styleUrl: './activo-form.component.css',
})
export class ActivoFormComponent {
  readonly saving = input<boolean>(false);
  readonly submitted = output<CreateActivoInput>();
  readonly cancelled = output<void>();

  readonly estados: EstadoActivo[] = ['activo', 'inactivo', 'en_mantenimiento', 'dado_de_baja'];

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    codigo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    descripcion: [''],
    categoria: ['', [Validators.required]],
    ubicacion: ['', [Validators.required]],
    estado: ['activo' as EstadoActivo, [Validators.required]],
    marca: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    numeroSerie: ['', [Validators.required]],
    valorAdquisicion: [0, [Validators.required, Validators.min(0)]],
    fechaAdquisicion: ['', [Validators.required]],
    imagenUrl: [''],
    tagsRaw: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const tags = v.tagsRaw
      ? v.tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    this.submitted.emit({
      codigo: v.codigo,
      nombre: v.nombre,
      descripcion: v.descripcion,
      categoria: v.categoria,
      ubicacion: v.ubicacion,
      estado: v.estado,
      marca: v.marca,
      modelo: v.modelo,
      numeroSerie: v.numeroSerie,
      valorAdquisicion: v.valorAdquisicion,
      fechaAdquisicion: v.fechaAdquisicion,
      imagenUrl: v.imagenUrl,
      tags,
    });
  }
}
