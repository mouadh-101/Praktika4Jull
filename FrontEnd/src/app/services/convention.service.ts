import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Convention} from "../core/model/db";
  // Importer le modèle Convention

@Injectable({
  providedIn: 'root'
})
export class ConventionService {
  private apiUrl = 'http://localhost:8222/api/conventions';  // L'URL de votre API backend (assurez-vous que l'URL est correcte)
  // Méthode pour ajouter une convention avec des termes
  addConvention(convention: Convention): Observable<Convention> {
    return this.http.post<Convention>(this.apiUrl, convention);
  }
  constructor(private http: HttpClient) {}

  // Méthode pour récupérer toutes les conventions depuis l'API
  getAllConventions(): Observable<Convention[]> {
    return this.http.get<Convention[]>(this.apiUrl);  // Appel à l'API pour récupérer les conventions
  }
  // Service method to delete a convention
  deleteConvention(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  getConventionById(id: number): Observable<Convention> {
    return this.http.get<Convention>(`${this.apiUrl}/${id}`);
  }

}
