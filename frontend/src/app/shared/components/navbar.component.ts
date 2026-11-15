import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar-container">
      <div class="nav-content">
        <div class="brand" routerLink="/">
          <div class="brand-badge">TELC</div>
          <span class="brand-text">prepare-for-telc</span>
        </div>

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link">About Us</a>
          <a routerLink="/contact" routerLinkActive="active" class="nav-link">Contact</a>

          <ng-container *ngIf="authService.currentUser$ | async as user">
            <!-- Student Links -->
            <ng-container *ngIf="user.role === 'ROLE_STUDENT'">
              <a routerLink="/student/dashboard" routerLinkActive="active" class="nav-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                My Exams
              </a>
            </ng-container>

            <!-- Teacher/Admin Links -->
            <ng-container *ngIf="user.role === 'ROLE_TEACHER' || user.role === 'ROLE_ADMIN'">
              <a routerLink="/teacher/dashboard" routerLinkActive="active" class="nav-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Overview
              </a>
              <a routerLink="/teacher/questions" routerLinkActive="active" class="nav-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Question Bank
              </a>
              <a routerLink="/teacher/exams" routerLinkActive="active" class="nav-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Exam Builder
              </a>
            </ng-container>
          </ng-container>
        </nav>

        <div class="user-actions">
          <ng-container *ngIf="authService.currentUser$ | async as user; else guestNav">
            <div class="user-badge">
              <span class="user-name">{{ user.name }}</span>
              <span class="role-pill" [ngClass]="user.role.toLowerCase()">
                {{ user.role.replace('ROLE_', '') }}
              </span>
            </div>
            <button (click)="logout()" class="btn-logout" title="Sign Out">
              Sign Out
            </button>
          </ng-container>

          <ng-template #guestNav>
            <a routerLink="/auth/login" class="nav-link">Login</a>
            <a routerLink="/auth/register" class="btn-primary-sm">Get Started</a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-container {
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      position: sticky;
      top: 0;
      z-index: 50;
      color: #f8fafc;
    }
    .nav-content {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }
    .brand-badge {
      background: #dc2626;
      color: #ffffff;
      font-weight: 800;
      font-size: 0.85rem;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    .brand-text {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      transition: all 0.15s ease-in-out;
    }
    .nav-link:hover, .nav-link.active {
      color: #f8fafc;
      background: #1e293b;
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-badge {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .user-name {
      font-size: 0.875rem;
      color: #cbd5e1;
      font-weight: 500;
    }
    .role-pill {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .role-pill.role_teacher {
      background: #38bdf8;
      color: #082f49;
    }
    .role-pill.role_student {
      background: #4ade80;
      color: #052e16;
    }
    .role-pill.role_admin {
      background: #fbbf24;
      color: #451a03;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid #334155;
      color: #cbd5e1;
      font-size: 0.825rem;
      padding: 0.35rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-logout:hover {
      background: #ef4444;
      border-color: #ef4444;
      color: white;
    }
    .btn-primary-sm {
      background: #2563eb;
      color: white;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.4rem 0.9rem;
      border-radius: 6px;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
