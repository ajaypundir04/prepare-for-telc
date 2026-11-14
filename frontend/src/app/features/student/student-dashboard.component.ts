import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { AuthService } from '../../core/services/auth.service';
import { ExamAssignment, ExamResult } from '../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="dashboard-header">
        <div class="user-welcome">
          <h2>Candidate Portal</h2>
          <p>Welcome back, <strong>{{ authService.currentUserValue?.name }}</strong>. Prepare and take your official TELC simulations.</p>
        </div>
        <div class="stat-pill">
          <span class="stat-number">{{ activeAssignments.length }}</span>
          <span class="stat-text">Active Assignments</span>
        </div>
      </div>

      <!-- Active Assigned Exams Section -->
      <section class="dashboard-section">
        <div class="section-title-row">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Assigned Exams
          </h3>
          <span class="badge-count">{{ activeAssignments.length }} available</span>
        </div>

        <div *ngIf="loadingAssignments" class="loading-state">
          Loading assigned exams...
        </div>

        <div *ngIf="!loadingAssignments && activeAssignments.length === 0" class="empty-card">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>No pending exam assignments at this time. When your teacher dispatches a test, it will appear here.</p>
        </div>

        <div *ngIf="!loadingAssignments && activeAssignments.length > 0" class="exams-grid">
          <div *ngFor="let assignment of activeAssignments" class="assignment-card">
            <div class="card-top">
              <span class="level-pill">{{ assignment.exam.level }}</span>
              <span class="status-pill" [ngClass]="assignment.status.toLowerCase()">{{ assignment.status }}</span>
            </div>

            <h4 class="exam-title">{{ assignment.exam.title }}</h4>
            <p class="exam-desc">{{ assignment.exam.description }}</p>

            <div class="exam-meta">
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{{ assignment.exam.durationMinutes }} Minutes</span>
              </div>
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>{{ assignment.exam.questions.length }} Questions</span>
              </div>
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Assigned by {{ assignment.assignedBy.name }}</span>
              </div>
            </div>

            <div class="card-footer">
              <button (click)="startTest(assignment.id)" class="btn-start-exam">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Start TELC Exam
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Past Results Section -->
      <section class="dashboard-section">
        <div class="section-title-row">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Exam History & Results
          </h3>
          <span class="badge-count">{{ pastResults.length }} completed</span>
        </div>

        <div *ngIf="loadingResults" class="loading-state">
          Loading past results...
        </div>

        <div *ngIf="!loadingResults && pastResults.length === 0" class="empty-card">
          <p>No past exams completed yet. Take an assigned exam to view your score breakdown.</p>
        </div>

        <div *ngIf="!loadingResults && pastResults.length > 0" class="results-table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Level</th>
                <th>Date</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Outcome (≥60%)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let result of pastResults">
                <td class="exam-cell"><strong>{{ result.examTitle }}</strong></td>
                <td><span class="level-pill-sm">{{ result.examLevel }}</span></td>
                <td>{{ result.submittedAt | date:'mediumDate' }}</td>
                <td>{{ result.totalScore }} / {{ result.maxScore }} pts</td>
                <td class="percentage-cell">{{ result.percentage }}%</td>
                <td>
                  <span class="pass-fail-pill" [ngClass]="result.passed ? 'passed' : 'failed'">
                    {{ result.passed ? 'PASSED' : 'NOT PASSED' }}
                  </span>
                </td>
                <td>
                  <a [routerLink]="['/student/result', result.assignmentId]" class="btn-view-report">
                    View Breakdown
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 1.5rem;
    }
    .user-welcome h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
    }
    .user-welcome p {
      color: #94a3b8;
      margin: 0;
      font-size: 0.95rem;
    }
    .stat-pill {
      background: #1e293b;
      border: 1px solid #334155;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-number {
      font-size: 1.5rem;
      font-weight: 800;
      color: #38bdf8;
    }
    .stat-text {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
    }
    .dashboard-section {
      margin-bottom: 3rem;
    }
    .section-title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .section-title-row h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #f1f5f9;
      margin: 0;
    }
    .badge-count {
      font-size: 0.75rem;
      background: #1e293b;
      color: #94a3b8;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
    }
    .loading-state, .empty-card {
      background: #1e293b;
      border: 1px dashed #334155;
      border-radius: 10px;
      padding: 3rem 2rem;
      text-align: center;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .exams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }
    .assignment-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .assignment-card:hover {
      border-color: #38bdf8;
      transform: translateY(-2px);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .level-pill {
      background: #2563eb;
      color: white;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
    }
    .status-pill {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .status-pill.pending { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .status-pill.in_progress { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .exam-title {
      font-size: 1.15rem;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
      font-weight: 600;
    }
    .exam-desc {
      font-size: 0.85rem;
      color: #94a3b8;
      margin: 0 0 1.25rem 0;
      line-height: 1.4;
      flex-grow: 1;
    }
    .exam-meta {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
      padding-top: 0.75rem;
      border-top: 1px solid #334155;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #cbd5e1;
    }
    .btn-start-exam {
      width: 100%;
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.65rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-start-exam:hover {
      background: #1d4ed8;
    }
    .results-table-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }
    .data-table th {
      background: #0f172a;
      padding: 0.85rem 1rem;
      color: #94a3b8;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      border-bottom: 1px solid #334155;
    }
    .data-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid #334155;
      color: #cbd5e1;
    }
    .level-pill-sm {
      background: #1e293b;
      border: 1px solid #334155;
      color: #38bdf8;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
    .percentage-cell {
      font-weight: 700;
      color: #f8fafc;
    }
    .pass-fail-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
    }
    .pass-fail-pill.passed {
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
      border: 1px solid rgba(74, 222, 128, 0.3);
    }
    .pass-fail-pill.failed {
      background: rgba(248, 113, 113, 0.15);
      color: #f87171;
      border: 1px solid rgba(248, 113, 113, 0.3);
    }
    .btn-view-report {
      color: #38bdf8;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .btn-view-report:hover {
      text-decoration: underline;
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private examService = inject(ExamService);
  private router = inject(Router);

  activeAssignments: ExamAssignment[] = [];
  pastResults: ExamResult[] = [];
  loadingAssignments = true;
  loadingResults = true;

  ngOnInit(): void {
    this.loadAssignments();
    this.loadResults();
  }

  loadAssignments(): void {
    this.loadingAssignments = true;
    this.examService.getStudentAssignments().subscribe({
      next: (list) => {
        // filter active (pending or in_progress)
        this.activeAssignments = list.filter(a => a.status === 'PENDING' || a.status === 'IN_PROGRESS');
        this.loadingAssignments = false;
      },
      error: () => this.loadingAssignments = false
    });
  }

  loadResults(): void {
    this.loadingResults = true;
    this.examService.getStudentResults().subscribe({
      next: (results) => {
        this.pastResults = results;
        this.loadingResults = false;
      },
      error: () => this.loadingResults = false
    });
  }

  startTest(assignmentId: number): void {
    this.router.navigate(['/student/exam', assignmentId]);
  }
}
