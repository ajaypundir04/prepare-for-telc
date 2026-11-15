import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-page">
      <!-- Header Banner -->
      <section class="page-header">
        <div class="header-content">
          <div class="badge-telc">ABOUT THE PLATFORM</div>
          <h1>Empowering German Language Aspirants Worldwide</h1>
          <p>
            Prepare-for-TELC is a dedicated testing simulator engineered to give candidates the exact exam conditions, structure, and timing required to pass official TELC German language certifications.
          </p>
        </div>
      </section>

      <!-- Mission & Story -->
      <section class="content-section">
        <div class="section-grid">
          <div class="text-block">
            <span class="subheading">OUR MISSION</span>
            <h2>Bridging Opportunities Through Language Proficiency</h2>
            <p>
              Every year, hundreds of thousands of international students, doctors, healthcare workers, and professionals move to Germany, Austria, and Switzerland. Obtaining an official TELC certificate (*The European Language Certificates*) is often the single most critical milestone in validating their language competence.
            </p>
            <p>
              However, traditional preparation often relies on static PDFs without realistic timing, leaving candidates unprepared for the psychological pressure of the official exam hall. 
            </p>
            <p>
              We built <strong>Prepare-for-TELC</strong> to eliminate this gap by delivering full-length, timed mock tests with authentic audio guardrails and automated scoring that strictly enforces the official <strong>60.0% pass threshold</strong>.
            </p>
          </div>
          <div class="image-placeholder">
            <div class="stat-card">
              <span class="big-number">60.0%</span>
              <span class="stat-desc">Official Minimum Threshold to Pass any TELC Module</span>
            </div>
            <div class="stat-card highlight">
              <span class="big-number">CEFR</span>
              <span class="stat-desc">Common European Framework of Reference for Languages</span>
            </div>
            <div class="stat-card">
              <span class="big-number">A1–C1</span>
              <span class="stat-desc">From Basic Communication to C1 University Direct Entry</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Architecture & Integrity -->
      <section class="content-section dark-card">
        <div class="text-center-header">
          <span class="subheading">SYSTEM ARCHITECTURE</span>
          <h2>Engineered for Strict Academic Fairness</h2>
          <p>Our platform architecture reflects modern software principles to guarantee reliability and test fidelity.</p>
        </div>

        <div class="values-grid">
          <div class="value-item">
            <div class="value-icon">🏛️</div>
            <h3>Domain-Driven Design</h3>
            <p>The backend is built with Spring Boot 3.4 and Java 25 using Domain-Driven Design (DDD), cleanly separating student authentication, question banking, exam dispatching, and auto-grading bounded contexts.</p>
          </div>

          <div class="value-item">
            <div class="value-icon">🎧</div>
            <h3>Audio Protection</h3>
            <p>In accordance with official TELC rules, listening exam tracks are capped to 2 plays per section with local state tracking, ensuring students cannot repeatedly replay audio to guess answers.</p>
          </div>

          <div class="value-item">
            <div class="value-icon">⚡</div>
            <h3>Stateless Cloud Scaling</h3>
            <p>Deployed across Render’s Global CDN and PostgreSQL infrastructure with HikariCP connection pooling, providing sub-second latency and zero test disruptions during peak exam hours.</p>
          </div>
        </div>
      </section>

      <!-- Target Audiences -->
      <section class="content-section">
        <div class="text-center-header">
          <span class="subheading">WHO WE SERVE</span>
          <h2>Tailored for Candidates & Educators</h2>
        </div>

        <div class="audiences-grid">
          <div class="audience-card">
            <h4>🎓 University & Studienkolleg Candidates</h4>
            <p>Preparing for <strong>TELC Deutsch C1 Hochschule</strong>, recognized by all German universities as equivalent to TestDaF and DSH-2 for direct academic admission.</p>
          </div>

          <div class="audience-card">
            <h4>🩺 Doctors & Healthcare Specialists</h4>
            <p>Targeting <strong>TELC Deutsch B2 / C1 Medizin & Pflege</strong> for medical license recognition (Approbation) and professional registration across all German federal states.</p>
          </div>

          <div class="audience-card">
            <h4>💼 Skilled Workers & Job Seekers</h4>
            <p>Fulfilling EU Blue Card, Chancenkarte (Opportunity Card), and vocational training (Ausbildung) language prerequisites at levels B1 and B2.</p>
          </div>

          <div class="audience-card">
            <h4>🏫 Language Schools & Certified Teachers</h4>
            <p>Using our Teacher CMS to author custom question banks, assemble practice exams, dispatch them to student cohorts, and monitor pass rates in real time.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-banner">
        <div class="cta-inner">
          <h2>Ready to Begin Your Preparation?</h2>
          <p>Create an account today to take your first full-length diagnostic TELC exam.</p>
          <div class="cta-actions">
            <a routerLink="/auth/register" class="btn-primary">Register Free</a>
            <a routerLink="/contact" class="btn-outline">Contact Advisory</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-page {
      color: #f8fafc;
    }
    .page-header {
      background: radial-gradient(circle at 50% 10%, #1e293b 0%, #0b1120 100%);
      padding: 4.5rem 1.5rem 3.5rem 1.5rem;
      text-align: center;
      border-bottom: 1px solid #1e293b;
    }
    .header-content {
      max-width: 800px;
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
      margin-bottom: 1.25rem;
    }
    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1.25rem;
      line-height: 1.2;
    }
    .page-header p {
      font-size: 1.1rem;
      color: #94a3b8;
      line-height: 1.6;
    }

    .content-section {
      max-width: 1100px;
      margin: 0 auto;
      padding: 4.5rem 1.5rem;
    }
    .section-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3.5rem;
      align-items: center;
    }
    @media (max-width: 768px) {
      .section-grid { grid-template-columns: 1fr; }
    }
    .subheading {
      color: #38bdf8;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 0.5rem;
    }
    .text-block h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1.25rem;
      line-height: 1.3;
    }
    .text-block p {
      color: #94a3b8;
      font-size: 1rem;
      line-height: 1.7;
      margin-bottom: 1.25rem;
    }
    .image-placeholder {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .stat-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
    }
    .stat-card.highlight {
      border-color: #0284c7;
      background: rgba(2, 132, 199, 0.1);
    }
    .big-number {
      font-size: 2.2rem;
      font-weight: 800;
      color: #38bdf8;
    }
    .stat-desc {
      font-size: 0.875rem;
      color: #cbd5e1;
      margin-top: 0.35rem;
    }

    /* Dark Card Section */
    .dark-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
    }
    .text-center-header {
      text-align: center;
      max-width: 650px;
      margin: 0 auto 3rem auto;
    }
    .text-center-header h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0.5rem 0 1rem 0;
    }
    .text-center-header p {
      color: #94a3b8;
      font-size: 1rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    .value-item {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2rem;
    }
    .value-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .value-item h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.75rem;
    }
    .value-item p {
      color: #94a3b8;
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 0;
    }

    /* Audiences */
    .audiences-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .audience-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 1.75rem;
    }
    .audience-card h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.75rem;
    }
    .audience-card p {
      color: #94a3b8;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    /* CTA */
    .cta-banner {
      background: linear-gradient(135deg, #0284c7 0%, #1e293b 100%);
      padding: 4.5rem 1.5rem;
      text-align: center;
      border-top: 1px solid #38bdf8;
    }
    .cta-inner {
      max-width: 600px;
      margin: 0 auto;
    }
    .cta-inner h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.75rem;
    }
    .cta-inner p {
      color: #e0f2fe;
      margin-bottom: 1.75rem;
    }
    .cta-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .btn-primary {
      background: #ffffff;
      color: #0284c7;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
    }
    .btn-outline {
      border: 2px solid #ffffff;
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
    }
  `]
})
export class AboutComponent {}
