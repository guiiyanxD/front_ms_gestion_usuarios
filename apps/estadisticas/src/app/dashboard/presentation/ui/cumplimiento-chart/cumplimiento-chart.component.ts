import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CumplimientoItem } from '../../../domain/models/dashboard.model';

// ── Geometría SVG (constantes de módulo, no expuestas al template) ──────────
const VW = 700, VH = 268;
const PL = 44, PT = 20, PB = 46, PR = 20;
const CW = VW - PL - PR;   // 636
const CH = VH - PT - PB;   // 202
const BASE_Y = PT + CH;    // 222

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function shortLabel(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`;
}

interface Gridline { value: number; y: number; }
interface Bar      { x: number; y: number; w: number; h: number; }
interface Group {
  item: CumplimientoItem;
  label: string;
  total: Bar;
  done:  Bar;
  cx:    number;
  lbY:   number;
}
interface ChartData { gridlines: Gridline[]; groups: Group[]; }

@Component({
  selector: 'app-cumplimiento-chart',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cumplimiento-chart.component.html',
  styleUrl:    './cumplimiento-chart.component.css',
})
export class CumplimientoChartComponent {
  readonly items = input.required<CumplimientoItem[]>();

  // Expuestos al template
  readonly VW = VW;
  readonly VH = VH;
  readonly PL = PL;
  readonly PT = PT;
  readonly CW = CW;
  readonly BASE_Y = BASE_Y;

  readonly chart = computed<ChartData | null>(() => {
    const data = this.items();
    if (!data.length) return null;

    const rawMax = Math.max(...data.map(i => i.preventivosTotal));
    const scale  = Math.ceil(rawMax / 4) * 4 || 4;
    const n      = data.length;
    const gw     = CW / n;
    const bw     = Math.min(gw * 0.30, 26);
    const gap    = 4;

    const gridlines: Gridline[] = [0.25, 0.5, 0.75, 1].map(f => ({
      value: Math.round(scale * f),
      y:     PT + CH * (1 - f),
    }));

    const groups: Group[] = data.map((item, i) => {
      const cx = PL + i * gw + gw / 2;
      const th = Math.max((item.preventivosTotal       / scale) * CH, 2);
      const dh = Math.max((item.preventivosCompletados / scale) * CH, 0);
      return {
        item,
        label: shortLabel(item.periodo),
        total: { x: cx - bw - gap / 2, y: BASE_Y - th, w: bw, h: th },
        done:  { x: cx + gap / 2,      y: BASE_Y - dh, w: bw, h: dh },
        cx,
        lbY: BASE_Y + 16,
      };
    });

    return { gridlines, groups };
  });
}
