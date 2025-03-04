import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Convention, Terms} from "../core/model/db";

@Injectable({
  providedIn: 'root'
})
export class TermsService {
  private apiUrl = 'http://localhost:8222/api/conventions';
  private termsUrl = 'http://localhost:8222/api/conventions/terms'
  constructor(private http: HttpClient) {}

  getAllTerms(): Observable<Terms[]> {
    return this.http.get<Terms[]>(`${this.termsUrl}/all`);
  }

  addTerms(terms: Terms): Observable<Terms> {
    return this.http.post<Terms>(`${this.termsUrl}/add`, terms);
  }
  deleteTerm(termId: number): Observable<void> {
    return this.http.delete<void>(`${this.termsUrl}/delete/${termId}`);
  }

// Récupérer un terme par son ID
  getTermById(id: number): Observable<Terms> {
    return this.http.get<Terms>(`${this.termsUrl}/get/${id}`);
  }
  // Méthode pour récupérer toutes les conventions
  getAllConventions(): Observable<Convention[]> {
    return this.http.get<Convention[]>(this.termsUrl);
  }
  updateTerm(term: Terms): Observable<Terms> {
    return this.http.put<Terms>(`${this.termsUrl}/update/${term.termId}`, term);
  }
}
