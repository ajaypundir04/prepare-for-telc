import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="intro-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="badge-telc">STANDARDIZED TELC PREPARATION PLATFORM</div>
          <h1 class="hero-title">
            Master Your <span class="text-accent">TELC German</span> Exam with Confidence
          </h1>
          <p class="hero-subtitle">
            Experience realistic, timed mock exams aligned with the Common European Framework of Reference for Languages (CEFR). Practice reading, language elements, and audio listening with official scoring standards (≥ 60%).
          </p>
          <div class="hero-cta-group">
            <a routerLink="/auth/register" class="btn-hero-primary">Start Practicing Free</a>
            <a routerLink="/about" class="btn-hero-secondary">Explore Methodology</a>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">A1 – C1</span>
              <span class="stat-label">Full CEFR Levels</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">60.0%</span>
              <span class="stat-label">Official Pass Threshold</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">100%</span>
              <span class="stat-label">Automated Auto-Grading</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Exam Modules Grid -->
      <section class="section-container">
        <div class="section-header">
          <span class="section-tag">EXAMINATION MODULES</span>
          <h2>Authentic Test Structure</h2>
          <p>Every mock exam replicates the exact timing, question formats, and scoring weights of official TELC exams.</p>
        </div>

        <div class="modules-grid">
          <div class="module-card">
            <div class="module-icon lesen">📖</div>
            <h3>Leseverstehen (Reading)</h3>
            <p>Develop global, detailed, and selective reading skills through real-world news articles, announcements, and advertisements.</p>
            <ul class="module-features">
              <li>Multiple-choice & title matching</li>
              <li>Official time pacing guidelines</li>
              <li>Immediate answer diagnostic check</li>
            </ul>
          </div>

          <div class="module-card">
            <div class="module-icon sprach">🧩</div>
            <h3>Sprachbausteine (Grammar)</h3>
            <p>Master idiomatic expressions, fixed prepositional verbs, and structural connectives within coherent everyday texts.</p>
            <ul class="module-features">
              <li>Cloze tests with target vocabulary</li>
              <li>Level-specific syntax challenges</li>
              <li>Section percentage breakdown</li>
            </ul>
          </div>

          <div class="module-card">
            <div class="module-icon hoeren">🎧</div>
            <h3>Hörverstehen (Listening)</h3>
            <p>Practice realistic dialogues, broadcasts, and interviews under strict exam audio guardrails.</p>
            <ul class="module-features">
              <li>Strict 2-playback count restriction</li>
              <li>Clear audio wave visualization</li>
              <li>Native German pronunciation</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Levels Overview Section -->
      <section class="section-container alt-bg">
        <div class="section-header">
          <span class="section-tag">TARGET PROFICIENCY</span>
          <h2>Tailored for Every Goal</h2>
          <p>Whether you need a residency permit, job certification, or university admission in Germany.</p>
        </div>

        <div class="levels-grid">
          <div class="level-card">
            <div class="level-pill a1">A1 / A2</div>
            <h4>Beginner & Everyday</h4>
            <p>Focuses on essential everyday interactions, shopping, directions, and foundational syntax.</p>
            <span class="level-target">Residency & Family Reunification</span>
          </div>

          <div class="level-card featured">
            <div class="featured-badge">MOST POPULAR</div>
            <div class="level-pill b1">B1 / B2</div>
            <h4>Intermediate & Professional</h4>
            <p>Ideal for vocational training (Ausbildung), nursing registration, and German citizenship requirements.</p>
            <span class="level-target">Vocational & Workplace Integration</span>
          </div>

          <div class="level-card">
            <div class="level-pill c1">C1 Hochschule</div>
            <h4>Advanced Academic</h4>
            <p>Rigorous complex comprehension required for direct admission into German universities and medical boards.</p>
            <span class="level-target">Higher Education & Medicine</span>
          </div>
        </div>
      </section>

      <!-- Key Capabilities Section -->
      <section class="section-container">
        <div class="section-header">
          <span class="section-tag">PLATFORM FEATURES</span>
          <h2>Why Prepare with Us?</h2>
        </div>

        <div class="features-split">
          <div class="feature-box">
            <div class="feature-icon">⏱️</div>
            <div class="feature-text">
              <h4>Distraction-Free Exam Runner</h4>
              <p>Simulate official exam conditions with our live countdown timer, interactive question palette, and unsaved changes guard.</p>
            </div>
          </div>

          <div class="feature-box">
            <div class="feature-icon">📊</div>
            <div class="feature-text">
              <h4>Automated TELC Diagnostics</h4>
              <p>Instant evaluation upon submission. See your total score, passing status (≥ 60%), and module-specific strengths and weaknesses.</p>
            </div>
          </div>

          <div class="feature-box">
            <div class="feature-icon">👩‍🏫</div>
            <div class="feature-text">
              <h4>Teacher & Institution Portal</h4>
              <p>Educators can construct custom exams from the centralized question bank and dispatch tests directly to student cohorts.</p>
            </div>
          </div>

          <div class="feature-box">
            <div class="feature-icon">🛡️</div>
            <div class="feature-text">
              <h4>Fair Testing Audio Guardrails</h4>
              <p>Audio listening tests restrict tracks to authentic repeat limits, preserving test reliability and integrity.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Banner -->
      <section class="cta-banner">
        <div class="cta-content">
          <h2>Ready to pass your TELC exam on your first attempt?</h2>
          <p>Join thousands of candidates preparing smartly with authentic, graded mock exams.</p>
          <div class="cta-buttons">
            <a routerLink="/auth/register" class="btn-cta-white">Create Candidate Account</a>
            <a routerLink="/contact" class="btn-cta-outline">Speak with Our Team</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .intro-page {
      color: #f8fafc;
    }
    .hero-section {
      background: radial-gradient(circle at 50% 10%, #1e293b 0%, #0b1120 100%);
      padding: 5rem 1.5rem 4rem 1.5rem;
      text-align: center;
      border-bottom: 1px solid #1e293b;
    }
    .hero-content {
      max-width: 840px;
      margin: 0 auto;
    }
    .badge-telc {
      display: inline-block;
      background: rgba(220, 38, 38, 0.2);
      border: 1px solid #dc2626;
      color: #f87171;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      margin-bottom: 1.5rem;
    }
    .hero-title {
      font-size: 2.75rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1.25rem;
      color: #ffffff;
    }
    .text-accent {
      color: #38bdf8;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 2.25rem;
      max-width: 720px;
      margin-left: auto;
      margin-right: auto;
    }
    .hero-cta-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3.5rem;
    }
    .btn-hero-primary {
      background: #0284c7;
      color: #ffffff;
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-hero-primary:hover {
      background: #0369a1;
    }
    .btn-hero-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-hero-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .hero-stats {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid #1e293b;
      flex-wrap: wrap;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-number {
      font-size: 1.75rem;
      font-weight: 800;
      color: #38bdf8;
    }
    .stat-label {
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }
    .stat-divider {
      width: 1px;
      height: 36px;
      background: #334155;
    }

    /* Sections */
    .section-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 5rem 1.5rem;
    }
    .alt-bg {
      background: #0d1527;
      max-width: 100%;
      border-top: 1px solid #1e293b;
      border-bottom: 1px solid #1e293b;
    }
    .alt-bg .section-header, .alt-bg .levels-grid {
      max-width: 1100px;
      margin: 0 auto;
    }
    .section-header {
      text-align: center;
      margin-bottom: 3.5rem;
    }
    .section-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .section-header h2 {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0.5rem 0 1rem 0;
    }
    .section-header p {
      color: #94a3b8;
      font-size: 1.05rem;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Module Cards */
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.75rem;
    }
    .module-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2rem;
      transition: transform 0.2s, border-color 0.2s;
    }
    .module-card:hover {
      transform: translateY(-4px);
      border-color: #0284c7;
    }
    .module-icon {
      font-size: 2.2rem;
      margin-bottom: 1.25rem;
    }
    .module-card h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.75rem;
    }
    .module-card p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .module-features {
      list-style: none;
      padding: 0;
      margin: 0;
      border-top: 1px solid #334155;
      padding-top: 1rem;
    }
    .module-features li {
      color: #cbd5e1;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
    }
    .module-features li::before {
      content: "✓";
      color: #22c55e;
      font-weight: 700;
      margin-right: 0.5rem;
    }

    /* Levels */
    .levels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    .level-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2.25rem 1.75rem;
      position: relative;
    }
    .level-card.featured {
      border-color: #0284c7;
      box-shadow: 0 0 25px rgba(2, 132, 199, 0.25);
    }
    .featured-badge {
      position: absolute;
      top: -12px;
      right: 20px;
      background: #0284c7;
      color: white;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }
    .level-pill {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 800;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }
    .level-pill.a1 { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .level-pill.b1 { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .level-pill.c1 { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .level-card h4 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.75rem;
    }
    .level-card p {
      color: #94a3b8;
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }
    .level-target {
      display: block;
      color: #38bdf8;
      font-size: 0.8rem;
      font-weight: 600;
      border-top: 1px solid #334155;
      padding-top: 0.75rem;
    }

    /* Features Split */
    .features-split {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 2rem;
    }
    @media (max-width: 640px) {
      .features-split { grid-template-columns: 1fr; }
    }
    .feature-box {
      display: flex;
      gap: 1.25rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1.5rem;
    }
    .feature-icon {
      font-size: 1.8rem;
    }
    .feature-text h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.4rem;
    }
    .feature-text p {
      color: #94a3b8;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    /* CTA Banner */
    .cta-banner {
      background: linear-gradient(135deg, #0369a1 0%, #1e1b4b 100%);
      padding: 5rem 1.5rem;
      text-align: center;
      border-top: 1px solid #38bdf8;
    }
    .cta-content {
      max-width: 700px;
      margin: 0 auto;
    }
    .cta-content h2 {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1rem;
    }
    .cta-content p {
      font-size: 1.1rem;
      color: #e0f2fe;
      margin-bottom: 2rem;
    }
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn-cta-white {
      background: #ffffff;
      color: #0369a1;
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-cta-white:hover {
      background: #f1f5f9;
    }
    .btn-cta-outline {
      border: 2px solid #ffffff;
      color: #ffffff;
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-cta-outline:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class IntroComponent {
  authService = inject(AuthService);
}
