import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateMaintenanceInput, MaintenanceType } from '../../../domain/models/maintenance.model';

@Component({
  selector: 'app-tomar-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tomar-form.component.html',
  styleUrl: './tomar-form.component.css',
})
export class TomarFormComponent {
  readonly saving = input<boolean>(false);
  readonly maintenanceRequestId = input.required<string>();
  readonly userId = input.required<string>();
  readonly submitted = output<CreateMaintenanceInput>();
  readonly cancelled = output<void>();

  readonly types: MaintenanceType[] = ['CORRECTIVE', 'PREVENTIVE'];
  readonly typeLabels: Record<MaintenanceType, string> = { CORRECTIVE: 'Correctivo', PREVENTIVE: 'Preventivo' };

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    type: ['CORRECTIVE' as MaintenanceType, [Validators.required]],
    description: ['', [Validators.required]],
    imageUrl: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    this.submitted.emit({
      maintenanceRequestId: this.maintenanceRequestId(),
      type: v.type,
      description: v.description,
      userId: this.userId(),
      ...(v.imageUrl.trim() ? { imageUrl: v.imageUrl.trim() } : {}),
    });
  }
}
