import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Document, Duree, StatusDoc } from 'src/app/Models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = 'http://localhost:8088/api/Document';


constructor(private http: HttpClient) { }
// Ajouter un document
ajouterDocument(document: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/document`, document);
}
getDocuments(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/all`);
}
// Supprimer un document par ID
supprimerDocument(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/document/${id}`);
}

// Mettre à jour un document
updateDocument(document: any, id: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/update/${id}`, document);
}

// Chercher un document par ID
chercherDocument(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/document/${id}`);
}

// Valider un document
validerDocument(id: number): Observable<void> {
  return this.http.put<void>(`${this.baseUrl}/valider/${id}`, {});
}

// Refuser un document
refuserDocument(id: number): Observable<void> {
  return this.http.put<void>(`${this.baseUrl}/refuser/${id}`, {});
}

// Télécharger une demande de stage en PDF
telechargerDemandeStage(id: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/DemandeStage/${id}`, {
    responseType: 'blob'  // Indique que la réponse est un fichier binaire
  });
}

// Télécharger une lettre d'affectation en PDF
telechargerLettreAffectation(id: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/LettreAffectation/${id}`, {
    responseType: 'blob'  // Indique que la réponse est un fichier binaire
  });
}
getDocumentByDurre(Duree: Duree): Observable<Document[]> {
  const url = `${this.baseUrl}/filter?Duree=${Duree}`;
  return this.http.get<Document[]>(url);
}
getDocumentByStatusDoc(StatusDoc: StatusDoc): Observable<Document[]> {
  const url = `${this.baseUrl}/filterStatus?StatusDoc=${StatusDoc}`;
  return this.http.get<Document[]>(url);
}
generateQRCode(id: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/generateQRCode/${id}`, {
    responseType: 'blob',
  });
}

}
