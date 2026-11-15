import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-top">
          <!-- Col 1: Brand & Bio -->
          <div class="footer-col brand-col">
            <div class="footer-brand" routerLink="/">
              <span class="brand-badge">TELC</span>
              <span class="brand-title">prepare-for-telc</span>
            </div>
            <p class="brand-bio">
              Independent standardized examination simulator designed to help students, medical professionals, and international specialists achieve TELC German certification from level A1 to C1.
            </p>
            <div class="status-indicator">
              <span class="pulse-dot"></span>
              <span class="status-text">Production Simulation System Active</span>
            </div>
          </div>

          <!-- Col 2: Navigation -->
          <div class="footer-col">
            <h4>Platform</h4>
            <ul class="footer-links">
              <li><a routerLink="/">Home / Intro</a></li>
              <li><a routerLink="/about">About Us</a></li>
              <li><a routerLink="/contact">Contact Support</a></li>
              <li><a routerLink="/auth/login">Candidate Portal</a></li>
              <li><a routerLink="/auth/login">Teacher CMS</a></li>
            </ul>
          </div>

          <!-- Col 3: CEFR Levels -->
          <div class="footer-col">
            <h4>TELC Modules</h4>
            <ul class="footer-links">
              <li><span>TELC Deutsch A1 / A2</span></li>
              <li><span>TELC Deutsch B1 (Zertifikat)</span></li>
              <li><span>TELC Deutsch B2 (Allgemein)</span></li>
              <li><span>TELC Deutsch C1 Hochschule</span></li>
              <li><span>Lesen • Sprachbausteine • Hören</span></li>
            </ul>
          </div>

          <!-- Col 4: API & Standards -->
          <div class="footer-col">
            <h4>Developers & Specs</h4>
            <ul class="footer-links">
              <li><a routerLink="/swagger-ui.html" class="api-link">Swagger UI Documentation</a></li>
              <li><a href="/swagger.yml" target="_blank" class="api-link">OpenAPI 3.0.3 Contract</a></li>
              <li><span>Spring Boot 3.4 / Java 25 DDD</span></li>
              <li><span>Minimum Passing Score: 60.0%</span></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 Prepare-for-TELC Platform. Developed under Domain-Driven Design standards.</p>
          <p class="disclaimer">
            TELC is a registered trademark of telc gGmbH. This platform is an independent preparation resource and is not officially affiliated with or endorsed by telc gGmbH.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: #090e17;
      border-top: 1px solid #1e293b;
      color: #94a3b8;
      padding: 4rem 1.5rem 2rem 1.5rem;
      margin-top: auto;
    }
    .footer-container {
      max-width: 1100px;
      margin: 0 auto;
    }
    .footer-top {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }
    @media (max-width: 900px) {
      .footer-top {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 550px) {
      .footer-top {
        grid-template-columns: 1fr;
      }
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      margin-bottom: 1rem;
    }
    .brand-badge {
      background: #dc2626;
      color: white;
      font-weight: 800;
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    .brand-title {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.15rem;
    }
    .brand-bio {
      font-size: 0.85rem;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 1.25rem;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #38bdf8;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 8px #22c55e;
    }

    .footer-col h4 {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      letter-spacing: 0.02em;
    }
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .footer-links li a, .footer-links li span {
      font-size: 0.85rem;
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links li a:hover {
      color: #38bdf8;
    }
    .api-link {
      color: #38bdf8 !important;
    }

    .footer-bottom {
      border-top: 1px solid #1e293b;
      padding-top: 2rem;
      text-align: center;
      font-size: 0.8rem;
      line-height: 1.6;
    }
    .footer-bottom p {
      margin: 0.25rem 0;
    }
    .disclaimer {
      font-size: 0.75rem;
      color: #64748b;
      max-width: 800px;
      margin: 0.5rem auto 0 auto !important;
    }
  `]
})
export class FooterComponent {}
