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
  getStudentApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student`);
  }

  // Fetch applications for the company's internships
  getCompanyApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company`);
  }
  getApplicationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
