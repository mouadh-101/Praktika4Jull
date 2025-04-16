import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8222/api/Student/App';

  constructor(private http: HttpClient) { }
  addApplication(application: any,internId :number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${internId}`, application);
  }
}
