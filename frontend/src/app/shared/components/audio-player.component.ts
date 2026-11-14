import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="audio-guardrail-card" [ngClass]="{'locked': playsCount >= maxPlays}">
      <div class="guardrail-header">
        <div class="title-section">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <span class="guardrail-title">TELC Hören Audio Guardrail</span>
        </div>
        <div class="plays-badge" [ngClass]="{'limit-reached': playsCount >= maxPlays}">
          <span class="badge-label">Playbacks:</span>
          <strong>{{ playsCount }} / {{ maxPlays }}</strong>
        </div>
      </div>

      <div class="audio-body">
        <audio #audioElement [src]="audioUrl" (ended)="onAudioEnded()" (pause)="onPause()" (timeupdate)="onTimeUpdate()"></audio>

        <div class="controls-row">
          <button
            type="button"
            class="play-btn"
            [disabled]="playsCount >= maxPlays && !isPlaying"
            (click)="togglePlay()">
            <ng-container *ngIf="isPlaying">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              Pause
            </ng-container>
            <ng-container *ngIf="!isPlaying">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              {{ playsCount === 0 ? 'Play Audio' : 'Play Again (' + (maxPlays - playsCount) + ' left)' }}
            </ng-container>
          </button>

          <div class="playback-timeline">
            <span class="time-label">{{ currentTimeStr }}</span>
            <div class="time-track">
              <div class="time-fill" [style.width.%]="progressPct"></div>
            </div>
            <span class="time-label">{{ durationStr }}</span>
          </div>
        </div>

        <div *ngIf="playsCount >= maxPlays && !isPlaying" class="limit-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          <span>Audio constraint enforced: Maximum playback attempts reached ({{ maxPlays }}/{{ maxPlays }}). In accordance with official TELC exam rules, no additional playbacks are permitted.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .audio-guardrail-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.25rem;
      transition: all 0.2s ease;
    }
    .audio-guardrail-card.locked {
      border-color: #64748b;
      background: #090d16;
    }
    .guardrail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }
    .title-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #38bdf8;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .plays-badge {
      font-size: 0.8rem;
      background: #1e293b;
      color: #94a3b8;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      border: 1px solid #334155;
    }
    .plays-badge.limit-reached {
      background: #450a0a;
      color: #f87171;
      border-color: #dc2626;
    }
    .controls-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .play-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .play-btn:hover:not(:disabled) {
      background: #1d4ed8;
    }
    .play-btn:disabled {
      background: #334155;
      color: #64748b;
      cursor: not-allowed;
    }
    .playback-timeline {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex: 1;
    }
    .time-label {
      font-size: 0.75rem;
      font-family: monospace;
      color: #94a3b8;
      min-width: 35px;
    }
    .time-track {
      flex: 1;
      height: 6px;
      background: #1e293b;
      border-radius: 9999px;
      overflow: hidden;
    }
    .time-fill {
      height: 100%;
      background: #38bdf8;
      border-radius: 9999px;
      transition: width 0.1s linear;
    }
    .limit-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(220, 38, 38, 0.1);
      border: 1px solid rgba(220, 38, 38, 0.3);
      color: #fca5a5;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      margin-top: 0.75rem;
    }
  `]
})
export class AudioPlayerComponent implements OnInit {
  @Input() audioUrl: string = '';
  @Input() maxPlays: number = 2;
  @Input() questionId: number = 0;

  @ViewChild('audioElement') audioRef!: ElementRef<HTMLAudioElement>;

  playsCount: number = 0;
  isPlaying: boolean = false;
  progressPct: number = 0;
  currentTimeStr: string = '00:00';
  durationStr: string = '00:00';

  ngOnInit(): void {
    // Check local storage for persistent count per exam session
    const stored = localStorage.getItem(`audio_plays_${this.questionId}`);
    if (stored) {
      this.playsCount = parseInt(stored, 10) || 0;
    }
  }

  togglePlay(): void {
    const audio = this.audioRef.nativeElement;

    if (this.isPlaying) {
      audio.pause();
      this.isPlaying = false;
    } else {
      if (this.playsCount < this.maxPlays) {
        // Increment play count upon starting a playback
        this.playsCount++;
        localStorage.setItem(`audio_plays_${this.questionId}`, this.playsCount.toString());
        audio.play().catch(e => console.warn('Audio playback error', e));
        this.isPlaying = true;
      }
    }
  }

  onAudioEnded(): void {
    this.isPlaying = false;
    this.progressPct = 100;
  }

  onPause(): void {
    this.isPlaying = false;
  }

  onTimeUpdate(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;

    if (audio.duration && !isNaN(audio.duration)) {
      this.progressPct = (audio.currentTime / audio.duration) * 100;
      this.durationStr = this.formatSeconds(audio.duration);
    }
    this.currentTimeStr = this.formatSeconds(audio.currentTime);
  }

  private formatSeconds(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
