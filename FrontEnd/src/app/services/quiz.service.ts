import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, Quiz } from '../core/model/db';


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8085/api/quizzes';
  private apiUrlPython = 'http://127.0.0.1:5001/api/quizzes';

  constructor(private http: HttpClient) { }


    // Ajouter une convention
    addQuizPython(quiz: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrlPython}`, quiz);
    }

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  createQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quiz);
  }

  updateQuiz(id: number, quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${id}`, quiz);
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getQuizQuestions(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${quizId}/questions`);
  }
} 