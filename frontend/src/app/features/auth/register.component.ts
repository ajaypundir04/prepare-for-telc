import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <div class="badge-telc">TELC REGISTRATION</div>
          <h2>Create Your Account</h2>
          <p>Join prepare-for-telc as a student or test educator</p>
        </div>

        <div *ngIf="errorMessage" class="alert-error">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="name"
              required
              placeholder="e.g. Maria Schmidt"
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
              placeholder="e.g. maria@example.com"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">Password (min. 6 characters)</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="role">Account Role</label>
            <select id="role" name="role" [(ngModel)]="role" class="form-select">
              <option value="ROLE_STUDENT">Student / Test Candidate</option>
              <option value="ROLE_TEACHER">Teacher / Examiner</option>
            </select>
          </div>

          <button type="submit" [disabled]="loading" class="btn-primary-block">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>Already registered? </span>
          <a routerLink="/auth/login" class="link">Sign in here</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%);
    }
    .auth-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .badge-telc {
      display: inline-block;
      background: #dc2626;
      color: white;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }
    .auth-header h2 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }
    .auth-header p {
      color: #94a3b8;
      font-size: 0.875rem;
      margin: 0;
    }
    .alert-error {
      background: rgba(220, 38, 38, 0.15);
      border: 1px solid #dc2626;
      color: #fca5a5;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #cbd5e1;
    }
    .form-input, .form-select {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 0.65rem 0.85rem;
      color: #f8fafc;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.15s ease;
    }
    .form-input:focus, .form-select:focus {
      border-color: #38bdf8;
    }
    .btn-primary-block {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-primary-block:hover:not(:disabled) {
      background: #1d4ed8;
    }
    .btn-primary-block:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .link {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
    }
    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  role: Role = 'ROLE_STUDENT';
  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'ROLE_TEACHER' || res.role === 'ROLE_ADMIN') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please check inputs.';
      }
    });
  }
}
