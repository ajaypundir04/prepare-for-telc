import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam, ExamAssignment, ExamLevel, ExamResult } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private http = inject(HttpClient);
  private get apiUrl(): string {
    return environment.apiUrl;
  }

  // Exams
  getExams(level?: ExamLevel): Observable<Exam[]> {
    let params = new HttpParams();
    if (level) params = params.set('level', level);
    return this.http.get<Exam[]>(`${this.apiUrl}/exams`, { params });
  }

  getExam(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/exams/${id}`);
  }

  createExam(examData: {
    title: string;
    description: string;
    level: ExamLevel;
    durationMinutes: number;
    passingPercentage: number;
    questionIds: number[];
  }): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/exams`, examData);
  }

  // Assignments
  dispatchExam(dispatchData: {
    studentEmail: string;
    examId: number;
    expiresInDays?: number;
  }): Observable<ExamAssignment> {
    return this.http.post<ExamAssignment>(`${this.apiUrl}/assignments/dispatch`, dispatchData);
  }

  getStudentAssignments(): Observable<ExamAssignment[]> {
    return this.http.get<ExamAssignment[]>(`${this.apiUrl}/assignments/student`);
  }

  getTeacherAssignments(): Observable<ExamAssignment[]> {
    return this.http.get<ExamAssignment[]>(`${this.apiUrl}/assignments/teacher`);
  }

  getAssignment(id: number): Observable<ExamAssignment> {
    return this.http.get<ExamAssignment>(`${this.apiUrl}/assignments/${id}`);
  }

  startAssignment(id: number): Observable<ExamAssignment> {
    return this.http.post<ExamAssignment>(`${this.apiUrl}/assignments/${id}/start`, {});
  }

  // Submission & Results
  submitExam(assignmentId: number, answers: Record<number, string>): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.apiUrl}/assignments/${assignmentId}/submit`, { answers });
  }

  getResultByAssignment(assignmentId: number): Observable<ExamResult> {
    return this.http.get<ExamResult>(`${this.apiUrl}/results/assignment/${assignmentId}`);
  }

  getStudentResults(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results/student`);
  }

  getAllResults(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results/all`);
  }
}
