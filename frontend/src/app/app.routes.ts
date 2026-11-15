import { Routes } from '@angular/router';
import { IntroComponent } from './features/public/intro.component';
import { AboutComponent } from './features/public/about.component';
import { ContactComponent } from './features/public/contact.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { StudentDashboardComponent } from './features/student/student-dashboard.component';
import { ExamRunnerComponent } from './features/student/exam-runner.component';
import { ExamResultComponent } from './features/student/exam-result.component';
import { TeacherDashboardComponent } from './features/teacher/teacher-dashboard.component';
import { QuestionBankComponent } from './features/teacher/question-bank.component';
import { ExamManagerComponent } from './features/teacher/exam-manager.component';
import { authGuard } from './core/guards/auth.guard';
import { studentGuard, teacherGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public Pages
  { path: '', component: IntroComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // Authentication
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // Candidate / Student Portal
  {
    path: 'student/dashboard',
    component: StudentDashboardComponent,
    canActivate: [studentGuard]
  },
  {
    path: 'student/exam/:id',
    component: ExamRunnerComponent,
    canActivate: [studentGuard]
  },
  {
    path: 'student/result/:id',
    component: ExamResultComponent,
    canActivate: [authGuard]
  },

  // Educator / Teacher CMS
  {
    path: 'teacher/dashboard',
    component: TeacherDashboardComponent,
    canActivate: [teacherGuard]
  },
  {
    path: 'teacher/questions',
    component: QuestionBankComponent,
    canActivate: [teacherGuard]
  },
  {
    path: 'teacher/exams',
    component: ExamManagerComponent,
    canActivate: [teacherGuard]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
