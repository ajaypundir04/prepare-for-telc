import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExamService } from '../../core/services/exam.service';
import { ExamResult } from '../../core/models';

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="result-page" *ngIf="result">
      <!-- Top Outcome Banner -->
      <div class="outcome-banner" [ngClass]="result.passed ? 'banner-passed' : 'banner-failed'">
        <div class="banner-icon">
          <svg *ngIf="result.passed" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <svg *ngIf="!result.passed" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div class="banner-text">
          <div class="outcome-tag">{{ result.passed ? 'OFFICIAL CRITERIA MET' : 'CRITERIA NOT MET' }}</div>
          <h1>{{ result.passed ? 'HERZLICHEN GLÜCKWUNSCH! BESTANDEN' : 'NICHT BESTANDEN' }}</h1>
          <p>
            You scored <strong>{{ result.percentage }}%</strong> ({{ result.totalScore }} / {{ result.maxScore }} points).
            The official TELC threshold to pass is ≥ 60.0%.
          </p>
        </div>
      </div>

      <!-- Overview Header -->
      <div class="result-meta-card">
        <div class="meta-left">
          <span class="level-pill">{{ result.examLevel }}</span>
          <h2>{{ result.examTitle }}</h2>
          <div class="sub-meta">
            <span>Candidate: <strong>{{ result.studentName }}</strong></span>
            <span>•</span>
            <span>Submitted: {{ result.submittedAt | date:'medium' }}</span>
          </div>
        </div>

        <div class="action-right">
          <a routerLink="/student/dashboard" class="btn-return">
            Back to Dashboard
          </a>
        </div>
      </div>

      <!-- Section Scores Breakdown Grid -->
      <div class="section-breakdown-grid" *ngIf="result.sectionScores">
        <!-- LESEN CARD -->
        <div class="section-card">
          <div class="card-mod-header">
            <span class="mod-title">Leseverstehen</span>
            <span class="mod-code">LESEN</span>
          </div>
          <div class="mod-score">
            <span class="score-num">{{ result.sectionScores.LESEN.score || 0 }}</span>
            <span class="score-max">/ {{ result.sectionScores.LESEN.maxScore || 0 }} pts</span>
          </div>
          <div class="progress-wrap">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="result.sectionScores.LESEN.percentage || 0"></div>
            </div>
            <span class="pct-text">{{ result.sectionScores.LESEN.percentage || 0 }}%</span>
          </div>
        </div>

        <!-- SPRACHBAUSTEINE CARD -->
        <div class="section-card">
          <div class="card-mod-header">
            <span class="mod-title">Sprachbausteine</span>
            <span class="mod-code">GRAMMATIK</span>
          </div>
          <div class="mod-score">
            <span class="score-num">{{ result.sectionScores.SPRACHBAUSTEINE.score || 0 }}</span>
            <span class="score-max">/ {{ result.sectionScores.SPRACHBAUSTEINE.maxScore || 0 }} pts</span>
          </div>
          <div class="progress-wrap">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="result.sectionScores.SPRACHBAUSTEINE.percentage || 0"></div>
            </div>
            <span class="pct-text">{{ result.sectionScores.SPRACHBAUSTEINE.percentage || 0 }}%</span>
          </div>
        </div>

        <!-- HOEREN CARD -->
        <div class="section-card">
          <div class="card-mod-header">
            <span class="mod-title">Hörverstehen</span>
            <span class="mod-code">HÖREN</span>
          </div>
          <div class="mod-score">
            <span class="score-num">{{ result.sectionScores.HOEREN.score || 0 }}</span>
            <span class="score-max">/ {{ result.sectionScores.HOEREN.maxScore || 0 }} pts</span>
          </div>
          <div class="progress-wrap">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="result.sectionScores.HOEREN.percentage || 0"></div>
            </div>
            <span class="pct-text">{{ result.sectionScores.HOEREN.percentage || 0 }}%</span>
          </div>
        </div>
      </div>

      <!-- Question-by-Question Review -->
      <div class="review-section">
        <h3>Question-by-Question Diagnostic Review</h3>

        <div class="review-list">
          <div
            *ngFor="let item of result.questionsReview; let i = index"
            class="review-item"
            [ngClass]="item.correct ? 'item-correct' : 'item-incorrect'">

            <div class="review-top">
              <div class="q-info">
                <span class="q-tag">Question #{{ i + 1 }}</span>
                <span class="module-tag">{{ item.module }}</span>
                <span class="status-indicator" [ngClass]="item.correct ? 'correct' : 'incorrect'">
                  {{ item.correct ? 'CORRECT' : 'INCORRECT' }}
                </span>
              </div>
              <span class="points-earned">
                {{ item.pointsEarned }} / {{ item.maxPoints }} points
              </span>
            </div>

            <p class="review-qtext"><strong>{{ item.questionText }}</strong></p>

            <div class="comparison-grid">
              <div class="ans-box chosen" [ngClass]="item.correct ? 'match' : 'mismatch'">
                <span class="ans-label">Your Choice:</span>
                <span class="ans-val">{{ item.chosenAnswer || 'No answer selected' }}</span>
              </div>
              <div class="ans-box correct">
                <span class="ans-label">Correct Master Key:</span>
                <span class="ans-val">{{ item.correctAnswer }}</span>
              </div>
            </div>

            <div *ngIf="item.explanation" class="explanation-box">
              <strong>Pedagogical Explanation:</strong>
              <p>{{ item.explanation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .result-page {
      max-width: 1100px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    .outcome-banner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem 2.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    .banner-passed {
      background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
      border: 1px solid #059669;
      color: #ecfdf5;
    }
    .banner-failed {
      background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%);
      border: 1px solid #dc2626;
      color: #fef2f2;
    }
    .banner-icon {
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      padding: 0.75rem;
      display: flex;
    }
    .outcome-tag {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 0.25rem;
    }
    .banner-text h1 {
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
    }
    .banner-text p {
      font-size: 1rem;
      margin: 0;
      opacity: 0.95;
    }
    .result-meta-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .level-pill {
      background: #2563eb;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.55rem;
      border-radius: 4px;
    }
    .meta-left h2 {
      font-size: 1.35rem;
      color: #f8fafc;
      margin: 0.5rem 0;
    }
    .sub-meta {
      display: flex;
      gap: 0.65rem;
      color: #94a3b8;
      font-size: 0.85rem;
    }
    .btn-return {
      background: #0f172a;
      border: 1px solid #334155;
      color: #cbd5e1;
      text-decoration: none;
      padding: 0.55rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .btn-return:hover {
      background: #334155;
      color: white;
    }
    .section-breakdown-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .section-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1.25rem;
    }
    .card-mod-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .mod-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .mod-code {
      font-size: 0.7rem;
      background: #0f172a;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      color: #94a3b8;
    }
    .mod-score {
      margin-bottom: 0.75rem;
    }
    .score-num {
      font-size: 1.75rem;
      font-weight: 800;
      color: #38bdf8;
    }
    .score-max {
      font-size: 0.9rem;
      color: #94a3b8;
      margin-left: 0.25rem;
    }
    .progress-wrap {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .progress-bar {
      flex: 1;
      height: 6px;
      background: #0f172a;
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #38bdf8;
      border-radius: 9999px;
    }
    .pct-text {
      font-size: 0.8rem;
      font-weight: 700;
      color: #cbd5e1;
      min-width: 38px;
    }
    .review-section h3 {
      font-size: 1.25rem;
      color: #f8fafc;
      margin-bottom: 1.25rem;
    }
    .review-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .review-item {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
    }
    .review-item.item-correct {
      border-left: 4px solid #10b981;
    }
    .review-item.item-incorrect {
      border-left: 4px solid #ef4444;
    }
    .review-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .q-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .q-tag {
      font-weight: 700;
      color: #f8fafc;
      font-size: 0.9rem;
    }
    .module-tag {
      background: #0f172a;
      color: #94a3b8;
      font-size: 0.7rem;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
    .status-indicator {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .status-indicator.correct {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    .status-indicator.incorrect {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }
    .points-earned {
      font-size: 0.85rem;
      color: #cbd5e1;
      font-weight: 600;
    }
    .review-qtext {
      color: #f1f5f9;
      font-size: 0.95rem;
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .ans-box {
      padding: 0.65rem 0.85rem;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      font-size: 0.85rem;
    }
    .ans-box.match {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .ans-box.mismatch {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .ans-box.correct {
      background: rgba(37, 99, 235, 0.1);
      border: 1px solid rgba(37, 99, 235, 0.3);
    }
    .ans-label {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
    }
    .ans-val {
      font-weight: 700;
      color: #f8fafc;
    }
    .explanation-box {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #cbd5e1;
    }
    .explanation-box strong {
      color: #38bdf8;
      display: block;
      margin-bottom: 0.25rem;
    }
    .explanation-box p {
      margin: 0;
      line-height: 1.4;
    }
  `]
})
export class ExamResultComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private examService = inject(ExamService);

  result: ExamResult | null = null;

  ngOnInit(): void {
    const assignmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (assignmentId) {
      this.examService.getResultByAssignment(assignmentId).subscribe({
        next: (res) => this.result = res,
        error: (err) => console.error('Failed to load results', err)
      });
    }
  }
}
