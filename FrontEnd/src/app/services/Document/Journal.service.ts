import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Journal } from 'src/app/Models/Journal';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = 'http://localhost:8088/api/journals/'; 
 
  constructor(private http: HttpClient) { }

  deleteJournal(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + 'delete/' + id);
  }
  getJournalsByStageId(id: number): Observable<Journal[]> {
    return this.http.get<Journal[]>(`${this.apiUrl}listaffecter/${id}`, );
  }
  
addJournal(journal: Journal, idStage: number): Observable<Journal> {
  
  return this.http.post<Journal>(`${this.apiUrl}add/${idStage}`,journal);
}
updateJournal(journal: any, id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}update/${id}`, journal);
}
getJournalById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}journal/${id}`);
}

}
