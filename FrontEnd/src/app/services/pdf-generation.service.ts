import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PdfGenerationService {

  private apiUrl = 'http://localhost:8222/api/conventions';
  private termsUrl = 'http://localhost:8222/api/conventions/terms';

  constructor(private http: HttpClient) {}
  generatePdf(conId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${conId}/pdf`, {
      responseType: 'blob'
    });
  }
}
