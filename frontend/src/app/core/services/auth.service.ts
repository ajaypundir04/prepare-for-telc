import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, Role, User } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('telc_token');
  }

  private getStoredUser(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const userJson = localStorage.getItem('telc_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('telc_token', res.token);
          const user: User = { id: res.id, email: res.email, name: res.name, role: res.role };
          localStorage.setItem('telc_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(userData: { email: string; password: string; name: string; role: Role }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('telc_token', res.token);
          const user: User = { id: res.id, email: res.email, name: res.name, role: res.role };
          localStorage.setItem('telc_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('telc_token');
      localStorage.removeItem('telc_user');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: Role): boolean {
    const user = this.currentUserValue;
    return !!user && user.role === role;
  }

  isTeacherOrAdmin(): boolean {
    const user = this.currentUserValue;
    return !!user && (user.role === 'ROLE_TEACHER' || user.role === 'ROLE_ADMIN');
  }

  isStudent(): boolean {
    const user = this.currentUserValue;
    return !!user && user.role === 'ROLE_STUDENT';
  }
}
