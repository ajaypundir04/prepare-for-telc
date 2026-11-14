import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamLevel, ExamModule, Question } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private http = inject(HttpClient);
  private get apiUrl(): string {
    return `${environment.apiUrl}/questions`;
  }

  getQuestions(level?: ExamLevel, module?: ExamModule): Observable<Question[]> {
    let params = new HttpParams();
    if (level) params = params.set('level', level);
    if (module) params = params.set('module', module);
    return this.http.get<Question[]>(this.apiUrl, { params });
  }

  getQuestion(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  updateQuestion(id: number, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
