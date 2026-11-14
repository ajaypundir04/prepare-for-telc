import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../core/services/exam.service';
import { QuestionService } from '../../core/services/question.service';
import { Exam, ExamLevel, Question } from '../../core/models';

@Component({
  selector: 'app-exam-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cms-page">
      <div class="cms-header">
        <div>
          <h2>TELC Exam Blueprint Builder</h2>
          <p>Assemble standardized TELC exams by linking question items and setting test constraints</p>
        </div>
        <button (click)="openCreateModal()" class="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Build Exam Blueprint
        </button>
      </div>

      <!-- Exams List -->
      <div *ngIf="loading" class="state-card">Loading exam blueprints...</div>

      <div *ngIf="!loading && exams.length === 0" class="state-card">
        No exam blueprints created yet. Click "Build Exam Blueprint" to compose one.
      </div>

      <div *ngIf="!loading && exams.length > 0" class="exams-grid">
        <div *ngFor="let ex of exams" class="exam-card">
          <div class="card-head">
            <span class="level-badge">{{ ex.level }}</span>
            <span class="pass-badge">Pass: {{ ex.passingPercentage }}%</span>
          </div>

          <h3 class="exam-title">{{ ex.title }}</h3>
          <p class="exam-desc">{{ ex.description }}</p>

          <div class="exam-specs">
            <div class="spec-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{{ ex.durationMinutes }} Minutes</span>
            </div>
            <div class="spec-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>{{ ex.questions.length }} Questions Linked</span>
            </div>
          </div>

          <div class="linked-modules">
            <span class="mod-pill">Lesen</span>
            <span class="mod-pill">Sprachbausteine</span>
            <span class="mod-pill">Hören</span>
          </div>

          <div class="card-footer">
            <button (click)="openQuickDispatch(ex)" class="btn-dispatch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Dispatch to Candidate
            </button>
          </div>
        </div>
      </div>

      <!-- Create Exam Blueprint Modal -->
      <div *ngIf="showCreateModal" class="modal-backdrop">
        <div class="modal-card wide">
          <h3>Compose New TELC Exam Blueprint</h3>
          <p class="modal-sub">Select title, target level, time limit, and link questions from the bank.</p>

          <form (ngSubmit)="saveExam()">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Exam Title</label>
                <input type="text" [(ngModel)]="newExam.title" name="title" required placeholder="e.g. TELC Deutsch B2 - Modelltest 2" class="form-input" />
              </div>
              <div class="form-group">
                <label>Level</label>
                <select [(ngModel)]="newExam.level" name="level" class="form-select">
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Duration (Minutes)</label>
                <input type="number" [(ngModel)]="newExam.durationMinutes" name="duration" min="15" max="300" class="form-input" />
              </div>
              <div class="form-group">
                <label>Passing Threshold (%)</label>
                <input type="number" [(ngModel)]="newExam.passingPercentage" name="passingPct" min="40" max="100" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="newExam.description" name="description" rows="2" placeholder="Official description, instructions, or exam guidelines" class="form-textarea"></textarea>
            </div>

            <!-- Question Picker List -->
            <div class="form-group">
              <label>Select Questions to Link ({{ selectedQuestionIds.size }} selected):</label>
              <div class="question-selector-box">
                <div *ngFor="let q of availableQuestions" class="selector-row">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [checked]="selectedQuestionIds.has(q.id)"
                      (change)="toggleQuestionSelection(q.id)"
                    />
                    <div class="q-label-meta">
                      <span class="q-level-tag">{{ q.level }} • {{ q.module }}</span>
                      <span class="q-title-text">{{ q.title }}</span>
                      <span class="q-points-tag">{{ q.points }} pts</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="showCreateModal = false" class="btn-cancel">Cancel</button>
              <button type="submit" [disabled]="saving || selectedQuestionIds.size === 0" class="btn-confirm">
                {{ saving ? 'Assembling...' : 'Assemble Exam' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Quick Dispatch Modal -->
      <div *ngIf="showDispatchModal" class="modal-backdrop">
        <div class="modal-card">
          <h3>Dispatch "{{ selectedExamForDispatch?.title }}"</h3>
          <p class="modal-sub">Assign this exam to a candidate email address.</p>

          <form (ngSubmit)="confirmDispatch()">
            <div class="form-group">
              <label>Candidate Email</label>
              <input type="email" [(ngModel)]="dispatchEmail" name="email" required placeholder="student@telc.com" class="form-input" />
            </div>

            <div class="form-group">
              <label>Valid For (Days)</label>
              <input type="number" [(ngModel)]="dispatchDays" name="days" min="1" max="90" class="form-input" />
            </div>

            <div class="modal-actions">
              <button type="button" (click)="showDispatchModal = false" class="btn-cancel">Cancel</button>
              <button type="submit" [disabled]="dispatching || !dispatchEmail" class="btn-confirm">
                {{ dispatching ? 'Dispatching...' : 'Dispatch' }}
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
    .state-card {
      background: #1e293b;
      border: 1px dashed #334155;
      border-radius: 10px;
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
    .exams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.5rem;
    }
    .exam-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .level-badge {
      background: #2563eb;
      color: white;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
    }
    .pass-badge {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
    }
    .exam-title {
      font-size: 1.15rem;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }
    .exam-desc {
      font-size: 0.85rem;
      color: #94a3b8;
      margin: 0 0 1.25rem 0;
      line-height: 1.4;
      flex-grow: 1;
    }
    .exam-specs {
      display: flex;
      gap: 1.25rem;
      font-size: 0.8rem;
      color: #cbd5e1;
      margin-bottom: 0.85rem;
    }
    .spec-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .linked-modules {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }
    .mod-pill {
      background: #0f172a;
      border: 1px solid #334155;
      color: #94a3b8;
      font-size: 0.7rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }
    .card-footer {
      border-top: 1px solid #334155;
      padding-top: 1rem;
    }
    .btn-dispatch {
      width: 100%;
      background: #0f172a;
      border: 1px solid #38bdf8;
      color: #38bdf8;
      padding: 0.55rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-dispatch:hover {
      background: #38bdf8;
      color: #0f172a;
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
    .modal-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2rem;
      max-width: 480px;
      width: 100%;
    }
    .modal-card.wide {
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-card h3 {
      font-size: 1.25rem;
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
    .question-selector-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      max-height: 220px;
      overflow-y: auto;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .selector-row {
      padding: 0.45rem 0.65rem;
      border-radius: 4px;
      background: #1e293b;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      cursor: pointer;
      width: 100%;
    }
    .checkbox-label input {
      accent-color: #2563eb;
    }
    .q-label-meta {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex: 1;
      font-size: 0.85rem;
    }
    .q-level-tag {
      font-size: 0.7rem;
      color: #38bdf8;
      font-weight: 700;
    }
    .q-title-text {
      color: #f1f5f9;
      flex: 1;
    }
    .q-points-tag {
      font-size: 0.75rem;
      color: #94a3b8;
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
export class ExamManagerComponent implements OnInit {
  private examService = inject(ExamService);
  private questionService = inject(QuestionService);

  exams: Exam[] = [];
  availableQuestions: Question[] = [];
  loading = true;

  showCreateModal = false;
  saving = false;
  selectedQuestionIds = new Set<number>();

  newExam = {
    title: '',
    description: '',
    level: 'B2' as ExamLevel,
    durationMinutes: 90,
    passingPercentage: 60.0
  };

  showDispatchModal = false;
  selectedExamForDispatch: Exam | null = null;
  dispatchEmail = '';
  dispatchDays = 7;
  dispatching = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.examService.getExams().subscribe(exs => {
      this.exams = exs;
      this.loading = false;
    });
    this.questionService.getQuestions().subscribe(qs => {
      this.availableQuestions = qs;
    });
  }

  openCreateModal(): void {
    this.selectedQuestionIds.clear();
    this.newExam = {
      title: '',
      description: '',
      level: 'B2',
      durationMinutes: 90,
      passingPercentage: 60.0
    };
    this.showCreateModal = true;
  }

  toggleQuestionSelection(id: number): void {
    if (this.selectedQuestionIds.has(id)) {
      this.selectedQuestionIds.delete(id);
    } else {
      this.selectedQuestionIds.add(id);
    }
  }

  saveExam(): void {
    if (!this.newExam.title || this.selectedQuestionIds.size === 0) return;
    this.saving = true;

    this.examService.createExam({
      ...this.newExam,
      questionIds: Array.from(this.selectedQuestionIds)
    }).subscribe({
      next: () => {
        this.saving = false;
        this.showCreateModal = false;
        this.loadData();
      },
      error: (err) => {
        this.saving = false;
        alert('Save error: ' + (err.error?.message || 'Check fields'));
      }
    });
  }

  openQuickDispatch(exam: Exam): void {
    this.selectedExamForDispatch = exam;
    this.dispatchEmail = '';
    this.dispatchDays = 7;
    this.showDispatchModal = true;
  }

  confirmDispatch(): void {
    if (!this.selectedExamForDispatch || !this.dispatchEmail) return;
    this.dispatching = true;

    this.examService.dispatchExam({
      studentEmail: this.dispatchEmail,
      examId: this.selectedExamForDispatch.id,
      expiresInDays: this.dispatchDays
    }).subscribe({
      next: () => {
        this.dispatching = false;
        this.showDispatchModal = false;
        alert(`Dispatched "${this.selectedExamForDispatch?.title}" to ${this.dispatchEmail}!`);
      },
      error: (err) => {
        this.dispatching = false;
        alert('Dispatch error: ' + (err.error?.message || 'Candidate not found'));
      }
    });
  }
}
