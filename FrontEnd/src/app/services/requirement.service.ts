import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  private apiUrl = 'http://localhost:8222/api/internships/requirements/by-field'; // Ajout de /by-field

  constructor(private http: HttpClient) {}

  getRequirementsByField(field: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?field=${encodeURIComponent(field)}`);
  }

}
