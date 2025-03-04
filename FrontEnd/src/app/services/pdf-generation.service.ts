import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PdfGenerationService {


  // pdf-generation.service.ts
  private apiUrl = 'http://localhost:8222/api/generate-pdf';  // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }
  generatePdf(conId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${conId}`, {
      responseType: 'blob'
    });
  }
}
