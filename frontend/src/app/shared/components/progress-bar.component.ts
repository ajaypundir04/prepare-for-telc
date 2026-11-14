import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container">
      <div class="progress-header">
        <span class="label">{{ label || 'Exam Progress' }}</span>
        <span class="count">{{ current }} / {{ total }} answered ({{ percentage }}%)</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" [style.width.%]="percentage"></div>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #94a3b8;
      margin-bottom: 0.35rem;
      font-weight: 500;
    }
    .count {
      color: #38bdf8;
      font-weight: 600;
    }
    .progress-track {
      height: 8px;
      background: #1e293b;
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #38bdf8, #2563eb);
      border-radius: 9999px;
      transition: width 0.3s ease-in-out;
    }
  `]
})
export class ProgressBarComponent {
  @Input() current: number = 0;
  @Input() total: number = 0;
  @Input() label?: string;

  get percentage(): number {
    if (!this.total || this.total <= 0) return 0;
    return Math.round((this.current / this.total) * 100);
  }
}
