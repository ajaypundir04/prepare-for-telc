import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../core/services/exam.service';
import { ExamAssignment, ExamModule, Question } from '../../core/models';
import { TimerComponent } from '../../shared/components/timer.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar.component';
import { AudioPlayerComponent } from '../../shared/components/audio-player.component';

@Component({
  selector: 'app-exam-runner',
  standalone: true,
  imports: [CommonModule, FormsModule, TimerComponent, ProgressBarComponent, AudioPlayerComponent],
  template: `
    <div class="runner-page" *ngIf="assignment">
      <!-- Distraction-free Runner Top Bar -->
      <div class="runner-topbar">
        <div class="runner-meta">
          <span class="badge-telc">TELC {{ assignment.exam.level }}</span>
          <h2 class="exam-title">{{ assignment.exam.title }}</h2>
        </div>

        <div class="topbar-controls">
          <app-timer
            [durationMinutes]="assignment.exam.durationMinutes"
            (timeExpired)="onTimeExpired()">
          </app-timer>

          <button (click)="openSubmitModal()" class="btn-submit-exam">
            Submit Exam
          </button>
        </div>
      </div>

      <!-- Runner Progress & Section Selector -->
      <div class="runner-subbar">
        <div class="progress-wrap">
          <app-progress-bar
            [current]="answeredCount"
            [total]="totalQuestions">
          </app-progress-bar>
        </div>

        <div class="module-tabs">
          <button
            type="button"
            class="tab-btn"
            [ngClass]="{'active': selectedModule === 'ALL'}"
            (click)="selectedModule = 'ALL'">
            All ({{ totalQuestions }})
          </button>
          <button
            type="button"
            class="tab-btn"
            [ngClass]="{'active': selectedModule === 'LESEN'}"
            (click)="selectedModule = 'LESEN'">
            Lesen ({{ getModuleCount('LESEN') }})
          </button>
          <button
            type="button"
            class="tab-btn"
            [ngClass]="{'active': selectedModule === 'SPRACHBAUSTEINE'}"
            (click)="selectedModule = 'SPRACHBAUSTEINE'">
            Sprachbausteine ({{ getModuleCount('SPRACHBAUSTEINE') }})
          </button>
          <button
            type="button"
            class="tab-btn"
            [ngClass]="{'active': selectedModule === 'HOEREN'}"
            (click)="selectedModule = 'HOEREN'">
            Hören ({{ getModuleCount('HOEREN') }})
          </button>
        </div>
      </div>

      <!-- Main Question Runner Body -->
      <div class="runner-content">
        <div class="questions-column">
          <div
            *ngFor="let q of filteredQuestions; let i = index"
            class="question-card"
            [id]="'q-' + q.id">

            <div class="question-header">
              <div class="q-badge">
                <span class="q-number">Question #{{ getGlobalIndex(q) + 1 }}</span>
                <span class="q-module-tag">{{ q.module }}</span>
              </div>
              <span class="q-points">{{ q.points }} Points</span>
            </div>

            <!-- Reading Passage Context if Available -->
            <div *ngIf="q.passage" class="passage-box">
              <div class="passage-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span>Lesetext / Kontext</span>
              </div>
              <p class="passage-text">{{ q.passage }}</p>
            </div>

            <!-- Listening Audio Guardrail if Hören Module -->
            <div *ngIf="q.module === 'HOEREN' && q.audioUrl" class="audio-section">
              <app-audio-player
                [audioUrl]="q.audioUrl"
                [maxPlays]="q.maxAudioPlays || 2"
                [questionId]="q.id">
              </app-audio-player>
            </div>

            <div class="question-text">
              <p>{{ q.questionText }}</p>
            </div>

            <!-- MCQ Radio Options -->
            <div class="options-group">
              <label
                *ngFor="let opt of q.options; let optIdx = index"
                class="option-item"
                [ngClass]="{'selected': answers[q.id] === getOptionLetter(opt, optIdx)}">
                <input
                  type="radio"
                  [name]="'q_' + q.id"
                  [value]="getOptionLetter(opt, optIdx)"
                  [checked]="answers[q.id] === getOptionLetter(opt, optIdx)"
                  (change)="selectAnswer(q.id, getOptionLetter(opt, optIdx))"
                />
                <span class="option-label">{{ opt }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Question Navigation Drawer -->
        <div class="sidebar-column">
          <div class="nav-palette">
            <h4>Question Palette</h4>
            <div class="palette-grid">
              <button
                *ngFor="let q of assignment.exam.questions; let idx = index"
                type="button"
                class="palette-btn"
                [ngClass]="{'answered': !!answers[q.id]}"
                (click)="scrollToQuestion(q.id)">
                {{ idx + 1 }}
              </button>
            </div>

            <div class="palette-legend">
              <div class="legend-item">
                <span class="legend-dot answered"></span>
                <span>Answered ({{ answeredCount }})</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot unanswered"></span>
                <span>Unanswered ({{ totalQuestions - answeredCount }})</span>
              </div>
            </div>

            <button (click)="openSubmitModal()" class="btn-submit-sidebar">
              Finish & Grade Test
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Confirmation Modal -->
      <div *ngIf="showSubmitModal" class="modal-backdrop">
        <div class="modal-card">
          <h3>Ready to Submit?</h3>
          <p>
            You have answered <strong>{{ answeredCount }} of {{ totalQuestions }}</strong> questions.
          </p>
          <p *ngIf="answeredCount < totalQuestions" class="warning-text">
            ⚠️ You have {{ totalQuestions - answeredCount }} unanswered questions. Unanswered questions will receive 0 points.
          </p>
          <div class="modal-actions">
            <button (click)="showSubmitModal = false" class="btn-cancel">Continue Test</button>
            <button (click)="confirmSubmit()" [disabled]="submitting" class="btn-confirm-submit">
              {{ submitting ? 'Grading Test...' : 'Yes, Submit Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .runner-page {
      min-height: 100vh;
      background: #090d16;
      color: #f8fafc;
      padding-bottom: 4rem;
    }
    .runner-topbar {
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      padding: 0.85rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .badge-telc {
      background: #dc2626;
      color: white;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      margin-right: 0.5rem;
    }
    .exam-title {
      display: inline;
      font-size: 1.15rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0;
    }
    .topbar-controls {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .btn-submit-exam {
      background: #16a34a;
      color: white;
      border: none;
      padding: 0.5rem 1.15rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-submit-exam:hover {
      background: #15803d;
    }
    .runner-subbar {
      background: #1e293b;
      border-bottom: 1px solid #334155;
      padding: 0.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .progress-wrap {
      flex: 1;
      max-width: 400px;
    }
    .module-tabs {
      display: flex;
      gap: 0.5rem;
    }
    .tab-btn {
      background: #0f172a;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tab-btn:hover, .tab-btn.active {
      color: #ffffff;
      background: #2563eb;
      border-color: #2563eb;
    }
    .runner-content {
      max-width: 1280px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
      align-items: start;
    }
    .questions-column {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .question-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid #334155;
      padding-bottom: 0.75rem;
    }
    .q-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .q-number {
      font-weight: 700;
      font-size: 1rem;
      color: #38bdf8;
    }
    .q-module-tag {
      background: #0f172a;
      border: 1px solid #334155;
      color: #94a3b8;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
    .q-points {
      font-size: 0.8rem;
      color: #cbd5e1;
      font-weight: 600;
    }
    .passage-box {
      background: #0f172a;
      border-left: 4px solid #38bdf8;
      padding: 1rem 1.25rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.25rem;
    }
    .passage-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #38bdf8;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .passage-text {
      font-size: 0.925rem;
      line-height: 1.6;
      color: #e2e8f0;
      margin: 0;
      white-space: pre-line;
    }
    .question-text {
      font-size: 1.05rem;
      font-weight: 600;
      color: #f8fafc;
      margin-bottom: 1.25rem;
      line-height: 1.5;
    }
    .options-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .option-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .option-item:hover {
      border-color: #38bdf8;
      background: #162032;
    }
    .option-item.selected {
      border-color: #2563eb;
      background: rgba(37, 99, 235, 0.15);
    }
    .option-item input {
      margin-top: 0.25rem;
      accent-color: #2563eb;
    }
    .option-label {
      font-size: 0.95rem;
      color: #f1f5f9;
      line-height: 1.4;
    }
    .sidebar-column {
      position: sticky;
      top: 90px;
    }
    .nav-palette {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.25rem;
    }
    .nav-palette h4 {
      font-size: 0.95rem;
      margin: 0 0 1rem 0;
      color: #f1f5f9;
      font-weight: 600;
    }
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .palette-btn {
      background: #0f172a;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 0.5rem 0;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .palette-btn.answered {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }
    .palette-legend {
      border-top: 1px solid #334155;
      padding-top: 0.85rem;
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .legend-dot.answered { background: #2563eb; }
    .legend-dot.unanswered { background: #0f172a; border: 1px solid #334155; }
    .btn-submit-sidebar {
      width: 100%;
      background: #16a34a;
      color: white;
      border: none;
      padding: 0.65rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .btn-submit-sidebar:hover { background: #15803d; }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1rem;
    }
    .modal-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2rem;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .modal-card h3 {
      font-size: 1.3rem;
      margin: 0 0 0.75rem 0;
      color: #f8fafc;
    }
    .modal-card p {
      color: #cbd5e1;
      font-size: 0.95rem;
      margin: 0 0 1rem 0;
    }
    .warning-text {
      color: #fca5a5 !important;
      background: rgba(220, 38, 38, 0.1);
      padding: 0.65rem;
      border-radius: 6px;
      border: 1px solid rgba(220, 38, 38, 0.2);
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
    .btn-cancel {
      background: transparent;
      border: 1px solid #475569;
      color: #cbd5e1;
      padding: 0.55rem 1rem;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-confirm-submit {
      background: #16a34a;
      color: white;
      border: none;
      padding: 0.55rem 1.25rem;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
    }
  `]
})
export class ExamRunnerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);

  assignment: ExamAssignment | null = null;
  selectedModule: 'ALL' | ExamModule = 'ALL';
  answers: Record<number, string> = {};
  showSubmitModal = false;
  submitting = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadAssignment(id);
    }
  }

  loadAssignment(id: number): void {
    this.examService.startAssignment(id).subscribe({
      next: (assignment) => {
        this.assignment = assignment;
      },
      error: (err) => {
        console.error('Error loading assignment', err);
        this.router.navigate(['/student/dashboard']);
      }
    });
  }

  get totalQuestions(): number {
    return this.assignment?.exam.questions.length || 0;
  }

  get answeredCount(): number {
    return Object.keys(this.answers).length;
  }

  get filteredQuestions(): Question[] {
    if (!this.assignment) return [];
    if (this.selectedModule === 'ALL') return this.assignment.exam.questions;
    return this.assignment.exam.questions.filter(q => q.module === this.selectedModule);
  }

  getModuleCount(mod: ExamModule): number {
    if (!this.assignment) return 0;
    return this.assignment.exam.questions.filter(q => q.module === mod).length;
  }

  getGlobalIndex(question: Question): number {
    if (!this.assignment) return 0;
    return this.assignment.exam.questions.findIndex(q => q.id === question.id);
  }

  getOptionLetter(optionText: string, index: number): string {
    const trimmed = optionText.trim();
    if (trimmed.length >= 2 && trimmed[1] === ')') {
      return trimmed[0].toUpperCase();
    }
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  selectAnswer(questionId: number, answerLetter: string): void {
    this.answers[questionId] = answerLetter;
  }

  scrollToQuestion(qId: number): void {
    const el = document.getElementById('q-' + qId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  openSubmitModal(): void {
    this.showSubmitModal = true;
  }

  onTimeExpired(): void {
    alert('Time has expired! Submitting your exam automatically.');
    this.confirmSubmit();
  }

  confirmSubmit(): void {
    if (!this.assignment) return;
    this.submitting = true;

    this.examService.submitExam(this.assignment.id, this.answers).subscribe({
      next: (result) => {
        this.submitting = false;
        this.showSubmitModal = false;
        this.router.navigate(['/student/result', this.assignment!.id]);
      },
      error: (err) => {
        this.submitting = false;
        alert('Submission failed: ' + (err.error?.message || 'Server error'));
      }
    });
  }
}
