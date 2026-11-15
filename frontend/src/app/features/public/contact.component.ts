import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="contact-page">
      <!-- Header -->
      <section class="page-header">
        <div class="header-content">
          <div class="badge-telc">ACADEMIC & CANDIDATE SUPPORT</div>
          <h1>Get in Touch with Our Team</h1>
          <p>
            Have questions about official exam formats, technical simulation issues, or institutional school licensing? We're here to help.
          </p>
        </div>
      </section>

      <!-- Main Section -->
      <section class="contact-section">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="form-card">
            <h2>Send Us a Message</h2>
            <p class="form-desc">Fill out the form below and an examination coordinator will reply within 24 hours.</p>

            <div *ngIf="submitted" class="alert-success">
              ✓ Vielen Dank! Your inquiry has been dispatched. Our team will contact you at <strong>{{ email }}</strong> shortly.
            </div>

            <form *ngIf="!submitted" (ngSubmit)="onSubmit()" class="contact-form">
              <div class="form-group">
                <label for="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="name"
                  required
                  placeholder="e.g. Klaus Meyer"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="email"
                  required
                  placeholder="e.g. klaus@example.com"
                  class="form-input"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="level">Targeted Exam Level</label>
                  <select id="level" name="level" [(ngModel)]="level" class="form-select">
                    <option value="A1">TELC A1 (Start Deutsch 1)</option>
                    <option value="A2">TELC A2</option>
                    <option value="B1">TELC B1 (Zertifikat Deutsch)</option>
                    <option value="B2">TELC B2 (Allgemein / Beruf)</option>
                    <option value="C1">TELC C1 Hochschule</option>
                    <option value="INSTITUTION">Language School / Institution</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="subject">Inquiry Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    [(ngModel)]="subject"
                    required
                    placeholder="e.g. Audio playback query"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="message">Detailed Message</label>
                <textarea
                  id="message"
                  name="message"
                  [(ngModel)]="message"
                  required
                  rows="5"
                  placeholder="How can our language testing specialists assist you?"
                  class="form-textarea"
                ></textarea>
              </div>

              <button type="submit" [disabled]="loading" class="btn-submit">
                {{ loading ? 'Sending...' : 'Transmit Message' }}
              </button>
            </form>
          </div>

          <!-- Contact Details & Info -->
          <div class="info-column">
            <div class="info-card">
              <h3>Direct Channels</h3>
              
              <div class="contact-item">
                <div class="icon">✉️</div>
                <div>
                  <span class="label">Candidate Support</span>
                  <a href="mailto:support@preparefortelc.com" class="val">support&#64;preparefortelc.com</a>
                </div>
              </div>

              <div class="contact-item">
                <div class="icon">🏫</div>
                <div>
                  <span class="label">School & Center Licensing</span>
                  <a href="mailto:institutions@preparefortelc.com" class="val">institutions&#64;preparefortelc.com</a>
                </div>
              </div>

              <div class="contact-item">
                <div class="icon">📍</div>
                <div>
                  <span class="label">Operations & Development</span>
                  <span class="val text-muted">Frankfurt am Main, Hesse, Germany</span>
                </div>
              </div>

              <div class="contact-item">
                <div class="icon">⏰</div>
                <div>
                  <span class="label">Advisory Hours</span>
                  <span class="val text-muted">Monday – Friday: 08:30 – 17:30 CET</span>
                </div>
              </div>
            </div>

            <div class="info-card highlight">
              <h3>Frequently Asked Questions</h3>
              
              <div class="faq-item">
                <h5>Is the 60% passing mark strict?</h5>
                <p>Yes. Just like the official TELC regulations, candidates must attain at least 60.0% of total points to earn a passing evaluation.</p>
              </div>

              <div class="faq-item">
                <h5>Can teachers assign exams to students?</h5>
                <p>Yes. The Teacher Portal allows educators to dispatch specific exams by student email with custom expiration windows.</p>
              </div>

              <div class="faq-item">
                <h5>Where can I see the API documentation?</h5>
                <p>Developers and partners can inspect our public OpenAPI specification at <a routerLink="/swagger-ui.html" class="link">/swagger-ui.html</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .contact-page {
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

    .contact-section {
      max-width: 1100px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1.3fr 0.9fr;
      gap: 3rem;
    }
    @media (max-width: 860px) {
      .contact-grid { grid-template-columns: 1fr; }
    }

    .form-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2.5rem;
    }
    .form-card h2 {
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .form-desc {
      color: #94a3b8;
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
    }
    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #cbd5e1;
    }
    .form-input, .form-select, .form-textarea {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      color: #f8fafc;
      font-size: 0.95rem;
      font-family: inherit;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #0284c7;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
    }
    .form-textarea {
      resize: vertical;
    }
    .btn-submit {
      background: #0284c7;
      color: #ffffff;
      padding: 0.85rem;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
      margin-top: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) {
      background: #0369a1;
    }
    .alert-success {
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid #22c55e;
      color: #86efac;
      padding: 1.25rem;
      border-radius: 8px;
      line-height: 1.6;
    }

    /* Info Column */
    .info-column {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .info-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2rem;
    }
    .info-card.highlight {
      border-color: #0284c7;
      background: rgba(15, 23, 42, 0.6);
    }
    .info-card h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #334155;
      padding-bottom: 0.75rem;
    }
    .contact-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }
    .contact-item .icon {
      font-size: 1.3rem;
    }
    .contact-item .label {
      display: block;
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .contact-item .val {
      font-size: 0.95rem;
      color: #38bdf8;
      text-decoration: none;
      font-weight: 500;
    }
    .contact-item .val.text-muted {
      color: #cbd5e1;
    }

    .faq-item {
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #334155;
    }
    .faq-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .faq-item h5 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.35rem;
    }
    .faq-item p {
      color: #94a3b8;
      font-size: 0.85rem;
      line-height: 1.5;
      margin: 0;
    }
    .link {
      color: #38bdf8;
      text-decoration: none;
    }
    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class ContactComponent {
  name = '';
  email = '';
  level = 'B2';
  subject = '';
  message = '';
  loading = false;
  submitted = false;

  onSubmit(): void {
    if (!this.name || !this.email || !this.message) return;
    this.loading = true;

    // Simulate reliable dispatch
    setTimeout(() => {
      this.loading = false;
      this.submitted = true;
    }, 600);
  }
}
