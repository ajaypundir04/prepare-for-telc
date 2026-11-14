import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../core/services/exam.service';
import { QuestionService } from '../../core/services/question.service';
import { AuthService } from '../../core/services/auth.service';
import { Exam, ExamAssignment, ExamResult, Question } from '../../core/models';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="teacher-page">
      <div class="teacher-header">
        <div>
          <h2>Teacher & Examiner CMS</h2>
          <p>Manage TELC questions, assemble standardized exam blueprints, and dispatch assignments</p>
        </div>
        <div class="action-buttons">
          <button (click)="openDispatchModal()" class="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Dispatch Exam
          </button>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-title">Question Bank Items</span>
          <span class="stat-value">{{ questionsCount }}</span>
          <span class="stat-sub">Across Lesen, Sprachb., Hören</span>
        </div>
        <div class="stat-card">
          <span class="stat-title">Exam Templates</span>
          <span class="stat-value">{{ examsCount }}</span>
          <span class="stat-sub">Official TELC Blueprints</span>
        </div>
        <div class="stat-card">
          <span class="stat-title">Assignments Dispatched</span>
          <span class="stat-value">{{ assignments.length }}</span>
          <span class="stat-sub">To Registered Candidates</span>
        </div>
        <div class="stat-card">
          <span class="stat-title">Completed Submissions</span>
          <span class="stat-value">{{ results.length }}</span>
          <span class="stat-sub">Auto-graded by Engine</span>
        </div>
      </div>

      <!-- Recent Submissions Table -->
      <div class="content-card">
        <div class="card-header">
          <h3>Recent Candidate Submissions & Auto-Graded Results</h3>
          <span class="badge">{{ results.length }} total</span>
        </div>

        <div *ngIf="loadingResults" class="loading-state">
          Loading submission logs...
        </div>

        <div *ngIf="!loadingResults && results.length === 0" class="empty-state">
          No candidate submissions yet. Dispatch an exam to get started.
        </div>

        <div *ngIf="!loadingResults && results.length > 0" class="table-responsive">
          <table class="cms-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Exam</th>
                <th>Level</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Outcome (≥60%)</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let res of results">
                <td>
                  <strong>{{ res.studentName }}</strong>
                  <div class="email-sub">{{ res.studentEmail }}</div>
                </td>
                <td>{{ res.examTitle }}</td>
                <td><span class="level-tag">{{ res.examLevel }}</span></td>
                <td>{{ res.totalScore }} / {{ res.maxScore }} pts</td>
                <td><strong>{{ res.percentage }}%</strong></td>
                <td>
                  <span class="status-pill" [ngClass]="res.passed ? 'passed' : 'failed'">
                    {{ res.passed ? 'PASSED' : 'FAILED' }}
                  </span>
                </td>
                <td>{{ res.submittedAt | date:'medium' }}</td>
                <td>
                  <a [routerLink]="['/student/result', res.assignmentId]" class="link-action">
                    Review
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Dispatch Modal -->
      <div *ngIf="showDispatchModal" class="modal-backdrop">
        <div class="modal-card">
          <h3>Dispatch Exam to Candidate</h3>
          <p class="modal-sub">Create an individual exam assignment linked to the candidate's account.</p>

          <form (ngSubmit)="submitDispatch()">
            <div class="form-group">
              <label>Candidate Email Address</label>
              <input
                type="email"
                [(ngModel)]="dispatchEmail"
                name="dispatchEmail"
                required
                placeholder="student@telc.com"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Select Exam Template</label>
              <select [(ngModel)]="dispatchExamId" name="dispatchExamId" required class="form-select">
                <option [ngValue]="null" disabled>Select an exam</option>
                <option *ngFor="let ex of exams" [value]="ex.id">
                  {{ ex.title }} ({{ ex.level }} - {{ ex.questions.length }} Qs)
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Expiration Window (Days)</label>
              <input
                type="number"
                [(ngModel)]="dispatchDays"
                name="dispatchDays"
                min="1"
                max="60"
                class="form-input"
              />
            </div>

            <div class="modal-actions">
              <button type="button" (click)="showDispatchModal = false" class="btn-cancel">Cancel</button>
              <button type="submit" [disabled]="dispatching || !dispatchEmail || !dispatchExamId" class="btn-confirm">
                {{ dispatching ? 'Dispatching...' : 'Confirm Dispatch' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .teacher-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    .teacher-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 1.5rem;
    }
    .teacher-header h2 {
      font-size: 1.75rem;
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
    }
    .teacher-header p {
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
      font-size: 0.9rem;
    }
    .btn-primary:hover { background: #1d4ed8; }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }
    .stat-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
    }
    .stat-title {
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 0.25rem;
    }
    .stat-sub {
      font-size: 0.75rem;
      color: #64748b;
    }
    .content-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      overflow: hidden;
    }
    .card-header {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
    }
    .card-header h3 {
      font-size: 1.15rem;
      color: #f8fafc;
      margin: 0;
    }
    .badge {
      background: #0f172a;
      color: #94a3b8;
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .cms-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }
    .cms-table th {
      background: #0f172a;
      padding: 0.85rem 1.25rem;
      color: #94a3b8;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      border-bottom: 1px solid #334155;
    }
    .cms-table td {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid #334155;
      color: #cbd5e1;
    }
    .email-sub {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .level-tag {
      background: #0f172a;
      border: 1px solid #334155;
      color: #38bdf8;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
    .status-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.55rem;
      border-radius: 9999px;
    }
    .status-pill.passed {
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
    }
    .status-pill.failed {
      background: rgba(248, 113, 113, 0.15);
      color: #f87171;
    }
    .link-action {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
    }
    .loading-state, .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
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
    .form-input, .form-select {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 0.65rem 0.85rem;
      color: #f8fafc;
      font-size: 0.95rem;
      outline: none;
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
export class TeacherDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private examService = inject(ExamService);
  private questionService = inject(QuestionService);

  questionsCount = 0;
  examsCount = 0;
  exams: Exam[] = [];
  assignments: ExamAssignment[] = [];
  results: ExamResult[] = [];
  loadingResults = true;

  showDispatchModal = false;
  dispatchEmail = '';
  dispatchExamId: number | null = null;
  dispatchDays = 7;
  dispatching = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.questionService.getQuestions().subscribe(qs => this.questionsCount = qs.length);
    this.examService.getExams().subscribe(exs => {
      this.exams = exs;
      this.examsCount = exs.length;
      if (exs.length > 0) {
        this.dispatchExamId = exs[0].id;
      }
    });
    this.examService.getTeacherAssignments().subscribe(as => this.assignments = as);
    this.examService.getAllResults().subscribe({
      next: (res) => {
        this.results = res;
        this.loadingResults = false;
      },
      error: () => this.loadingResults = false
    });
  }

  openDispatchModal(): void {
    this.showDispatchModal = true;
  }

  submitDispatch(): void {
    if (!this.dispatchEmail || !this.dispatchExamId) return;
    this.dispatching = true;

    this.examService.dispatchExam({
      studentEmail: this.dispatchEmail,
      examId: this.dispatchExamId,
      expiresInDays: this.dispatchDays
    }).subscribe({
      next: () => {
        this.dispatching = false;
        this.showDispatchModal = false;
        alert(`Successfully dispatched exam to ${this.dispatchEmail}!`);
        this.loadData();
      },
      error: (err) => {
        this.dispatching = false;
        alert('Dispatch error: ' + (err.error?.message || 'Candidate not found'));
      }
    });
  }
}
