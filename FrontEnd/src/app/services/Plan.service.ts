import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanDeTravail } from '../models/plan-de-travail.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://localhost:8222/api/internships/plan-travail'; // adapte l'URL selon ton backend

  constructor(private http: HttpClient) {}
  addPlan(planData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, planData);
  }
  
 
  getAllPlans(): Observable<PlanDeTravail[]> {
    return this.http.get<PlanDeTravail[]>(`${this.apiUrl}/plans`);
  }
  downloadPlan(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download?id=${id}`, { responseType: 'blob' });
  }

}
