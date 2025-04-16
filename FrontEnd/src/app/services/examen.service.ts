import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Examen {
  id?: number;
  titre: string;
  note: number;
  examenT: 'ORAL' | 'ECRIT';
  session: 'PRINCIPALE' | 'CONTROLE';
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  private apiUrl = 'http://localhost:8086/api/examens'; 

  constructor(private http: HttpClient) {}
  submitUserAnswers(payload: any, userId: any, ex: any): Observable<any> {
    return this.http.post('http://localhost:8086/api/chatbot/answers/submit?userId=' + userId + '&ExamenId=' + ex, payload, {
      responseType: 'text'
    });
}
getExamFull(id: number): Observable<any> {
  return this.http.get(`http://localhost:8086/api/chatbot/questions/${id}/full`);
}
addAnswerToQuestion(questionId: number, answer: any): Observable<any> {
  return this.http.post(`http://localhost:8086/api/chatbot/answers/${questionId}`, answer);
}
  addQuestionToExam(examId: number, question: any): Observable<any> {
    return this.http.post(`http://localhost:8086/api/chatbot/questions/${examId}`, question);
  }
  deleteQuestion(examId: number): Observable<any> {
    return this.http.delete(`http://localhost:8086/api/chatbot/questions/delete/${examId}`,{responseType:'text' as 'json'});
  }
  
  assignUserToExamen(examenId: number, userId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${examenId}/assign/${userId}`, {},{responseType:'text' as 'json'});
  }
  calcul(examenId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${examenId}/calcul`, {},{responseType:'text' as 'json'});
  }
  addnote(examenId: number, userId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${examenId}/note/${userId}`, {},{responseType:'text' as 'json'});
  }
    getAllexsuser(number:any): Observable<Examen[]> {
      return this.http.get<Examen[]>(this.apiUrl+"/buuser/"+number);
    }
  getExamens(): Observable<Examen[]> {
    return this.http.get<Examen[]>(this.apiUrl);
  }
  getExamensbyfor(id:number): Observable<Examen[]> {
    return this.http.get<Examen[]>(this.apiUrl+"/byformation?id="+id);
  }
  addExamen(examen: Examen, formationId: number): Observable<Examen> {
    return this.http.post<Examen>(`${this.apiUrl}/${formationId}`, examen);
  }
  getmoyenne(formationId: number,id:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${formationId}/${id}`);
  }
  updateExamen(id: number, examen: Examen): Observable<Examen> {
    return this.http.put<Examen>(`${this.apiUrl}/${id}`, examen);
  }

  deleteExamen(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType:'text' as 'json' });
  }

  participerExamen(examenId: number, userId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${examenId}/participer/${userId}`, {});
  }

  getParticipants(examenId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${examenId}/participants`);
  }
}
