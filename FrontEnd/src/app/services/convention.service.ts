import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {Convention, Terms} from '../core/model/db';

@Injectable({
  providedIn: 'root'
})
export class ConventionService {
  private apiUrl = 'http://localhost:8222/api/conventions';
  private termsUrl = 'http://localhost:8222/api/conventions/terms';


  constructor(private http: HttpClient) {
  }

  // Ajouter une convention
  addConvention(convention: Convention): Observable<Convention> {
    return this.http.post<Convention>(`${this.apiUrl}/add`, convention);
  }

  getAllTerms(): Observable<Terms[]> {
    return this.http.get<Terms[]>(this.termsUrl);
  }


  // Récupérer toutes les conventions
  getAllConventions(): Observable<Convention[]> {
    return this.http.get<Convention[]>(this.apiUrl);
  }

  // Supprimer une convention
  deleteConvention(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getConvention(id: number): Observable<Convention> {
    return this.http.get<Convention>(`${this.apiUrl}/${id}`);
  }

  // Récupérer une convention par ID
  // convention.service.ts
  // Dans ConventionService
  getConventionById(id: number): Observable<Convention> {
    return this.http.get<Convention>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          throw new Error('Convention non trouvée');
        }
        throw new Error('Erreur serveur');
      })
    );
  }

  // ConventionService
  updateConvention(id: number, convention: Convention): Observable<Convention> {
    return this.http.put<Convention>(`${this.apiUrl}/${id}`, convention); // Modifier selon votre endpoint
  }


  intelligentSearch(keyword: string, signed: boolean | null): Observable<Convention[]> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('signed', signed !== null ? signed.toString() : '');

    return this.http.get<Convention[]>(`${this.apiUrl}/search`, {params});
  }

  getConventionStatistics(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics/${startDate}/${endDate}`);
  }

  // Méthode d'envoi de l'email avec pièce jointe

  sendEmail(to: string, from: string, subject: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('to', to);
    formData.append('from', from);
    formData.append('subject', subject);
    formData.append('file', file);

    // Make sure the emailUrl is correctly referenced here
    return this.http.post<any>(`${this.apiUrl}/send/email`, formData);
  }


  signConvention(id: number, signatureData: string): Observable<Convention> {
    return this.http.put<Convention>(`${this.apiUrl}/sign/${id}`, { signatureData });
  }



}
