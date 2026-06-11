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
  readonly submitted = output<UpdateStatusInput>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    solucion: ['', Validators.required],
    costo: [null as number | null],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    this.submitted.emit({ newStatus: 'COMPLETED', solucion: v.solucion.trim(), costo: v.costo ?? 0 });
  }
}
