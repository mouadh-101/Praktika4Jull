import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Internship } from '../models/internship';


@Injectable({
  providedIn: 'root' 
})
export class InternshipService {

  private apiUrl = 'http://localhost:8222/api/internships';

  constructor(private http: HttpClient) { }
  getAllInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.apiUrl}/list`);
  }

  getMatchingInternship(): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.apiUrl}/matchInternships`);
  }

  getInternshipById(id: number): Observable<Internship> {
    return this.http.get<Internship>(`${this.apiUrl}/findInternshipById/${id}`);
  }
  addInternship(internship: Internship): Observable<Internship> {
    return this.http.post<Internship>(`${this.apiUrl}/addIntership`, internship);
  }
  addInternshipWithRequirements(internship: any, requirementNames: string[], companyId: string): Observable<any> {
    // Crée un objet pour envoyer les données nécessaires
    const internshipData = {
      ...internship,
      companyId: companyId,  // Ajoute l'ID de l'entreprise
      requirementNames: requirementNames  // Ajoute les exigences
    };

    // Envoie les données à l'API backend
    return this.http.post(`${this.apiUrl}/addIntership1/${companyId}`, internshipData);
  }
  
  getAvailableRequirements(): Observable<string[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.apiUrl}/requirements`).pipe(
      map((requirements: { id: number, name: string }[]) => requirements.map(requirement => requirement.name))
    );
  }
  
  
  updateInternship(id: number, internship: Internship): Observable<Internship> {
    return this.http.put<Internship>(`${this.apiUrl}/updateIntership/${id}`,internship);
  }
 
  deleteInternship(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteInternship/${id}`);
  }

// Méthode pour obtenir les internships filtrés
getFilteredInternships(filters: any): Observable<any[]> {
  let params = new HttpParams();

  // Ajoute tous les filtres à la requête HTTP
  if (filters.location) params = params.set('location', filters.location);
  if (filters.duration) params = params.set('duration', filters.duration.toString());
  if (filters.compensation) params = params.set('compensation', filters.compensation.toString());
  if (filters.field) params = params.set('field', filters.field);
  if (filters.remote !== undefined) params = params.set('remote', filters.remote.toString()); // Ajoute le filtre remote

  return this.http.get<any[]>(this.apiUrl, { params });
}






}
