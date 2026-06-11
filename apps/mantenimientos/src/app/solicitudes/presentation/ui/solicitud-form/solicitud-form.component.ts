import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateMaintenanceRequestInput, MaintenanceTipo, MaintenancePrioridad } from '../../../domain/models/maintenance-request.model';
import { FixedAssetOption } from '../../../../shared/fixed-asset-option/fixed-asset-option.model';
import { AreaOption } from '../../../../shared/area-option/area-option.model';

@Component({
  selector: 'app-solicitud-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitud-form.component.html',
  styleUrl: './solicitud-form.component.css',
})
export class SolicitudFormComponent {
  readonly saving = input<boolean>(false);
  readonly fixedAssets = input<FixedAssetOption[]>([]);
  readonly areas = input<AreaOption[]>([]);
  readonly submitted = output<CreateMaintenanceRequestInput>();
  readonly cancelled = output<void>();

  readonly tipos: MaintenanceTipo[] = ['CORRECTIVO', 'PREVENTIVO'];
  readonly prioridades: MaintenancePrioridad[] = ['ALTA', 'MEDIA', 'BAJA'];
  readonly tipoLabels: Record<MaintenanceTipo, string> = { CORRECTIVO: 'Correctivo', PREVENTIVO: 'Preventivo' };
  readonly prioridadLabels: Record<MaintenancePrioridad, string> = { ALTA: 'Alta', MEDIA: 'Media', BAJA: 'Baja', CRITICA: 'Crítica' };

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    fixedAssetId: ['', [Validators.required]],
    description: ['', [Validators.required]],
    tipo: ['CORRECTIVO' as MaintenanceTipo, [Validators.required]],
    prioridad: ['ALTA' as MaintenancePrioridad, [Validators.required]],
    areaId: [null as number | null, [Validators.required]],
  });

  readonly assetSearch = signal('');
  readonly showAssetDropdown = signal(false);
  readonly filteredAssets = computed(() => {
    const q = this.assetSearch().toLowerCase().trim();
    if (!q) return this.fixedAssets();
    return this.fixedAssets().filter(
      (a) => a.codigo.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    );
  });

  onAssetInput(value: string): void {
    this.assetSearch.set(value);
    this.form.controls.fixedAssetId.setValue('');
    this.showAssetDropdown.set(true);
  }

  selectAsset(asset: FixedAssetOption): void {
    this.assetSearch.set(`${asset.codigo} — ${asset.name}`);
    this.form.controls.fixedAssetId.setValue(asset.id);
    this.showAssetDropdown.set(false);
  }

  onAssetBlur(): void {
    setTimeout(() => this.showAssetDropdown.set(false), 150);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    this.submitted.emit({
      fixedAssetId: v.fixedAssetId,
      description: v.description,
      tipo: v.tipo,
      prioridad: v.prioridad,
      areaId: v.areaId!,
    });
  }
}
