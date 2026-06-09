import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type KpiVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kpi" [attr.data-variant]="variant()">
      <span class="kpi__label">{{ label() }}</span>
      <span class="kpi__value">{{ value() }}</span>
      @if (unit()) { <span class="kpi__unit">{{ unit() }}</span> }
    </div>
  `,
  styles: [`
    .kpi {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #4338ca;
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: .3rem;
      cursor: default;
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .kpi:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(67, 56, 202, .1);
    }
    .kpi[data-variant="success"]  { border-left-color: #16a34a; }
    .kpi[data-variant="success"]:hover  { box-shadow: 0 8px 24px rgba(22, 163, 74, .1); }
    .kpi[data-variant="warning"]  { border-left-color: #d97706; }
    .kpi[data-variant="warning"]:hover  { box-shadow: 0 8px 24px rgba(217, 119, 6, .1); }
    .kpi[data-variant="danger"]   { border-left-color: #dc2626; }
    .kpi[data-variant="danger"]:hover   { box-shadow: 0 8px 24px rgba(220, 38, 38, .1); }
    .kpi[data-variant="neutral"]  { border-left-color: #64748b; }
    .kpi[data-variant="neutral"]:hover  { box-shadow: 0 8px 24px rgba(100, 116, 139, .1); }

    .kpi__label {
      font-size: .7rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: .07em;
    }
    .kpi__value {
      font-size: 1.9rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.1;
    }
    .kpi__unit {
      font-size: .78rem;
      color: #64748b;
      font-weight: 500;
    }
  `],
})
export class KpiCardComponent {
  readonly label   = input.required<string>();
  readonly value   = input.required<string | number | null>();
  readonly unit    = input<string>('');
  readonly variant = input<KpiVariant>('primary');
}
