import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kpi">
      <span class="kpi__label">{{ label() }}</span>
      <span class="kpi__value">{{ value() }}</span>
      @if (unit()) { <span class="kpi__unit">{{ unit() }}</span> }
    </div>
  `,
  styles: [`
    .kpi { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: .25rem; }
    .kpi__label { font-size: .75rem; color: #64748b; text-transform: uppercase; letter-spacing: .05em; }
    .kpi__value { font-size: 2rem; font-weight: 700; color: #0f172a; line-height: 1; }
    .kpi__unit { font-size: .8rem; color: #64748b; }
  `],
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly unit = input<string>('');
}
