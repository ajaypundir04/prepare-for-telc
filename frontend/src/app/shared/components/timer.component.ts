import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timer-badge" [ngClass]="{'danger': remainingSeconds < 300, 'warning': remainingSeconds < 600 && remainingSeconds >= 300}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span class="timer-text">{{ formattedTime }}</span>
      <span *ngIf="remainingSeconds < 300" class="pulse-indicator">!</span>
    </div>
  `,
  styles: [`
    .timer-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid #334155;
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      font-family: ui-monospace, monospace;
      font-size: 0.95rem;
      font-weight: 700;
    }
    .timer-badge.warning {
      background: #451a03;
      border-color: #d97706;
      color: #fbbf24;
    }
    .timer-badge.danger {
      background: #450a0a;
      border-color: #dc2626;
      color: #f87171;
      animation: pulse 1.5s infinite;
    }
    .pulse-indicator {
      background: #dc2626;
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.75; }
    }
  `]
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() durationMinutes: number = 90;
  @Output() timeExpired = new EventEmitter<void>();

  remainingSeconds: number = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.remainingSeconds = this.durationMinutes * 60;
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startTimer(): void {
    this.intervalId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        if (this.remainingSeconds === 0) {
          clearInterval(this.intervalId);
          this.timeExpired.emit();
        }
      }
    }, 1000);
  }

  get formattedTime(): string {
    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    const seconds = this.remainingSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}
