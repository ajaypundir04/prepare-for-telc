import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../core/services/question.service';
import { ExamLevel, ExamModule, Question } from '../../core/models';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cms-page">
      <div class="cms-header">
        <div>
          <h2>Question Bank Repository</h2>
          <p>Curate standardized questions across levels (A1–C1) and modules (Lesen, Sprachbausteine, Hören)</p>
        </div>
        <button (click)="openCreateModal()" class="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Question
        </button>
      </div>

      <!-- Filters Row -->
      <div class="filters-bar">
        <div class="filter-item">
          <label>Filter by Level:</label>
          <select [(ngModel)]="filterLevel" (change)="loadQuestions()" class="filter-select">
            <option value="">All Levels</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>

        <div class="filter-item">
          <label>Filter by Module:</label>
          <select [(ngModel)]="filterModule" (change)="loadQuestions()" class="filter-select">
            <option value="">All Modules</option>
            <option value="LESEN">Leseverstehen (Lesen)</option>
            <option value="SPRACHBAUSTEINE">Sprachbausteine (Grammatik)</option>
            <option value="HOEREN">Hörverstehen (Hören)</option>
          </select>
        </div>

        <span class="count-tag">{{ questions.length }} items found</span>
      </div>

      <!-- Question Items List -->
      <div *ngIf="loading" class="state-card">Loading questions...</div>

      <div *ngIf="!loading && questions.length === 0" class="state-card">
        No questions match your current filter. Click "Add Question" to seed one.
      </div>

      <div *ngIf="!loading && questions.length > 0" class="questions-grid">
        <div *ngFor="let q of questions" class="question-card">
          <div class="card-badges">
            <span class="level-pill">{{ q.level }}</span>
            <span class="module-pill">{{ q.module }}</span>
            <span class="points-pill">{{ q.points }} pts</span>
          </div>

          <h4 class="q-title">{{ q.title }}</h4>
          <p class="q-text">{{ q.questionText }}</p>

          <div *ngIf="q.audioUrl" class="audio-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            <span>Audio linked (Max {{ q.maxAudioPlays }} plays)</span>
          </div>

          <div class="options-preview">
            <div
              *ngFor="let opt of q.options"
              class="opt-item"
              [ngClass]="{'is-correct': isOptionCorrect(opt, q.correctAnswer)}">
              {{ opt }}
              <span *ngIf="isOptionCorrect(opt, q.correctAnswer)" class="correct-badge">KEY</span>
            </div>
          </div>

          <div class="card-actions">
            <button (click)="deleteQuestion(q.id)" class="btn-delete" title="Delete Question">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Create Question Modal -->
      <div *ngIf="showModal" class="modal-backdrop">
        <div class="modal-card wide">
          <h3>Add New TELC Question</h3>
          <p class="modal-sub">Configure question metadata, passage or audio constraints, and answer keys.</p>

          <form (ngSubmit)="saveQuestion()">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Question Title / Task Reference</label>
                <input type="text" [(ngModel)]="newQ.title" name="title" required placeholder="e.g. Leseverstehen Teil 1: ..." class="form-input" />
              </div>
              <div class="form-group">
                <label>Level</label>
                <select [(ngModel)]="newQ.level" name="level" class="form-select">
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
              </div>
              <div class="form-group">
                <label>Module</label>
                <select [(ngModel)]="newQ.module" name="module" class="form-select">
                  <option value="LESEN">LESEN</option>
                  <option value="SPRACHBAUSTEINE">SPRACHBAUSTEINE</option>
                  <option value="HOEREN">HOEREN</option>
                </select>
              </div>
            </div>

            <!-- Reading Passage Context -->
            <div class="form-group">
              <label>Passage / Reading Context (Optional)</label>
              <textarea [(ngModel)]="newQ.passage" name="passage" rows="3" placeholder="Paste reading article or email text here..." class="form-textarea"></textarea>
            </div>

            <!-- Audio Fields (Visible if Module is HOEREN) -->
            <div class="form-row" *ngIf="newQ.module === 'HOEREN'">
              <div class="form-group flex-2">
                <label>Audio URL (.mp3 / CDN link)</label>
                <input type="text" [(ngModel)]="newQ.audioUrl" name="audioUrl" placeholder="https://cdn.example.com/audio.mp3" class="form-input" />
              </div>
              <div class="form-group">
                <label>Max Audio Plays</label>
                <input type="number" [(ngModel)]="newQ.maxAudioPlays" name="maxAudioPlays" min="1" max="5" class="form-input" />
              </div>
            </div>

            <!-- Question Prompt -->
            <div class="form-group">
              <label>Question Prompt / Text</label>
              <textarea [(ngModel)]="newQ.questionText" name="questionText" rows="2" required placeholder="What is the question being asked?" class="form-textarea"></textarea>
            </div>

            <!-- Options & Key -->
            <div class="form-group">
              <label>Options (One option per line)</label>
              <textarea [(ngModel)]="optionsRaw" name="optionsRaw" rows="4" required placeholder="A) Erste Option&#10;B) Zweite Option&#10;C) Dritte Option&#10;D) Vierte Option" class="form-textarea"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Correct Answer Letter</label>
                <input type="text" [(ngModel)]="newQ.correctAnswer" name="correctAnswer" required placeholder="e.g. A or B" class="form-input" style="max-width: 100px;" />
              </div>
              <div class="form-group">
                <label>Points</label>
                <input type="number" [(ngModel)]="newQ.points" name="points" min="1" class="form-input" style="max-width: 100px;" />
              </div>
              <div class="form-group flex-2">
                <label>Pedagogical Explanation</label>
                <input type="text" [(ngModel)]="newQ.explanation" name="explanation" placeholder="Explanation shown to student during diagnostic review" class="form-input" />
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="showModal = false" class="btn-cancel">Cancel</button>
              <button type="submit" [disabled]="saving" class="btn-confirm">
                {{ saving ? 'Saving...' : 'Save Question' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cms-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    .cms-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 1.5rem;
    }
    .cms-header h2 {
      font-size: 1.75rem;
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
    }
    .cms-header p {
      color: #94a3b8;
      margin: 0;
      font-size: 0.95rem;
    }
    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.65rem 1.25rem;
      border-radius: 6px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .btn-primary:hover { background: #1d4ed8; }
    .filters-bar {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: #1e293b;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      margin-bottom: 2rem;
      border: 1px solid #334155;
    }
    .filter-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .filter-item label {
      font-size: 0.85rem;
      color: #cbd5e1;
      font-weight: 500;
    }
    .filter-select {
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      outline: none;
    }
    .count-tag {
      margin-left: auto;
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .state-card {
      background: #1e293b;
      border: 1px dashed #334155;
      border-radius: 10px;
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
    .questions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.5rem;
    }
    .question-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-badges {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
    }
    .level-pill {
      background: #2563eb;
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
    .module-pill {
      background: #0f172a;
      color: #38bdf8;
      border: 1px solid #334155;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
    .points-pill {
      margin-left: auto;
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .q-title {
      font-size: 1.05rem;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }
    .q-text {
      font-size: 0.9rem;
      color: #cbd5e1;
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }
    .audio-notice {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.1);
      padding: 0.35rem 0.65rem;
      border-radius: 4px;
      margin-bottom: 0.85rem;
    }
    .options-preview {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
      border-top: 1px solid #334155;
      padding-top: 0.75rem;
    }
    .opt-item {
      font-size: 0.825rem;
      color: #94a3b8;
      background: #0f172a;
      padding: 0.4rem 0.65rem;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .opt-item.is-correct {
      border: 1px solid #10b981;
      color: #6ee7b7;
      background: rgba(16, 185, 129, 0.1);
    }
    .correct-badge {
      font-size: 0.65rem;
      font-weight: 800;
      background: #10b981;
      color: #064e3b;
      padding: 0.1rem 0.35rem;
      border-radius: 3px;
    }
    .card-actions {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid #334155;
      padding-top: 0.75rem;
    }
    .btn-delete {
      background: transparent;
      border: 1px solid #ef4444;
      color: #f87171;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-delete:hover {
      background: #ef4444;
      color: white;
    }
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
    .modal-card.wide {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2rem;
      max-width: 680px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-card h3 {
      font-size: 1.3rem;
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
    }
    .modal-sub {
      color: #94a3b8;
      font-size: 0.85rem;
      margin: 0 0 1.25rem 0;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .flex-2 { flex: 2; }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .form-group label {
      font-size: 0.85rem;
      color: #cbd5e1;
      font-weight: 500;
    }
    .form-input, .form-select, .form-textarea {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 0.6rem 0.85rem;
      color: #f8fafc;
      font-size: 0.9rem;
      outline: none;
    }
    .form-textarea {
      resize: vertical;
      line-height: 1.4;
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
    .btn-confirm {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.55rem 1.25rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class QuestionBankComponent implements OnInit {
  private questionService = inject(QuestionService);

  questions: Question[] = [];
  filterLevel: string = '';
  filterModule: string = '';
  loading = true;

  showModal = false;
  saving = false;
  optionsRaw = '';
  newQ: Partial<Question> = {
    title: '',
    level: 'B2',
    module: 'LESEN',
    passage: '',
    questionText: '',
    correctAnswer: 'A',
    points: 5,
    maxAudioPlays: 2,
    audioUrl: '',
    explanation: ''
  };

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    const lvl = this.filterLevel ? (this.filterLevel as ExamLevel) : undefined;
    const mod = this.filterModule ? (this.filterModule as ExamModule) : undefined;

    this.questionService.getQuestions(lvl, mod).subscribe({
      next: (list) => {
        this.questions = list;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  isOptionCorrect(opt: string, key?: string): boolean {
    if (!key) return false;
    const trimmed = opt.trim();
    if (trimmed.startsWith(key + ')') || trimmed.startsWith(key + '.') || trimmed.toUpperCase() === key.toUpperCase()) {
      return true;
    }
    return false;
  }

  openCreateModal(): void {
    this.optionsRaw = "A) Option 1\nB) Option 2\nC) Option 3\nD) Option 4";
    this.newQ = {
      title: '',
      level: 'B2',
      module: 'LESEN',
      passage: '',
      questionText: '',
      correctAnswer: 'A',
      points: 5,
      maxAudioPlays: 2,
      audioUrl: '',
      explanation: ''
    };
    this.showModal = true;
  }

  saveQuestion(): void {
    if (!this.newQ.title || !this.newQ.questionText || !this.newQ.correctAnswer) return;
    this.saving = true;

    const parsedOptions = this.optionsRaw
      .split('\n')
      .map(o => o.trim())
      .filter(o => o.length > 0);

    const payload = {
      ...this.newQ,
      options: parsedOptions
    };

    this.questionService.createQuestion(payload).subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.loadQuestions();
      },
      error: (err) => {
        this.saving = false;
        alert('Save failed: ' + (err.error?.message || 'Check input'));
      }
    });
  }

  deleteQuestion(id: number): void {
    if (!confirm('Are you sure you want to delete this question?')) return;
    this.questionService.deleteQuestion(id).subscribe({
      next: () => this.loadQuestions(),
      error: (err) => alert('Cannot delete question: ' + (err.error?.message || 'In use by an exam'))
    });
  }
}
