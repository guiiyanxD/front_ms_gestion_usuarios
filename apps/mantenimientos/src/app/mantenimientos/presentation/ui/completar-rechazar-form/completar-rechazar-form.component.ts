import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateStatusInput } from '../../../../solicitudes/domain/models/maintenance-request.model';

@Component({
  selector: 'app-completar-rechazar-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './completar-rechazar-form.component.html',
  styleUrl: './completar-rechazar-form.component.css',
})
export class CompletarRechazarFormComponent {
  readonly saving = input<boolean>(false);
  readonly mode = input.required<'completar' | 'rechazar'>();
  readonly submitted = output<UpdateStatusInput>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    diagnostico: [''],
    solucion: [''],
    costo: [null as number | null],
  });

  onSubmit(): void {
    const v = this.form.getRawValue();
    if (this.mode() === 'completar') {
      if (!v.solucion.trim()) { this.form.controls.solucion.setErrors({ required: true }); this.form.markAllAsTouched(); return; }
      this.submitted.emit({ newStatus: 'COMPLETED', solucion: v.solucion.trim(), costo: v.costo ?? 0 });
    } else {
      if (!v.diagnostico.trim()) { this.form.controls.diagnostico.setErrors({ required: true }); this.form.markAllAsTouched(); return; }
      this.submitted.emit({ newStatus: 'REJECTED', diagnostico: v.diagnostico.trim() });
    }
  }
}
