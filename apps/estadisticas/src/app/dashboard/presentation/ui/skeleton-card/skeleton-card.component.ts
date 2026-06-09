import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-card">
      <div class="skeleton skeleton--label"></div>
      <div class="skeleton skeleton--value"></div>
      @if (showUnit()) { <div class="skeleton skeleton--unit"></div> }
    </div>
  `,
  styles: [`
    .skeleton-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: .6rem;
    }
    .skeleton {
      border-radius: 4px;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }
    .skeleton--label { height: 10px; width: 55%; }
    .skeleton--value { height: 36px; width: 70%; }
    .skeleton--unit  { height: 10px; width: 30%; }

    @keyframes shimmer {
      0%   { background-position:  200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class SkeletonCardComponent {
  readonly showUnit = input<boolean>(true);
}
