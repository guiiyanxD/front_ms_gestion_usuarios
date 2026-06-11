import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Area } from '../../../domain/models/area.model';

@Component({
  selector: 'app-area-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './area-search.component.html',
  styleUrl: './area-search.component.css',
})
export class AreaSearchComponent {
  readonly areas = input.required<Area[]>();
  readonly selectedArea = input<Area | null>(null);
  readonly areaSelected = output<Area | null>();

  readonly inputValue = signal('');
  readonly open = signal(false);

  readonly filtered = computed(() => {
    const q = this.inputValue().toLowerCase().trim();
    if (!q) return this.areas();
    return this.areas().filter(
      (a) => a.nombre.toLowerCase().includes(q) || a.codigo.toLowerCase().includes(q)
    );
  });

  readonly displayValue = computed(() => {
    const sel = this.selectedArea();
    return sel ? sel.nombre : this.inputValue();
  });

  onInput(value: string): void {
    this.inputValue.set(value);
    this.open.set(true);
    if (!value) this.areaSelected.emit(null);
  }

  select(area: Area): void {
    this.inputValue.set('');
    this.open.set(false);
    this.areaSelected.emit(area);
  }

  clear(): void {
    this.inputValue.set('');
    this.open.set(false);
    this.areaSelected.emit(null);
  }

  onBlur(): void {
    setTimeout(() => this.open.set(false), 150);
  }
}
