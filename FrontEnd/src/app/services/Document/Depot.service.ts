import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Depot } from 'src/app/Models/Depot';
@Injectable({
  providedIn: 'root'
})
export class DepotService {

  private baseUrl = 'http://localhost:8088/api/depots'; 

  constructor(private http: HttpClient) { }
  addDocument(Rapport: File, Journal: File, Attestation: File, idDocument: number): Observable<Depot> {
    const formData: FormData = new FormData();
  
    // Ajouter les fichiers au FormData
    formData.append('Rapport', Rapport);
    formData.append('Journal', Journal);
    formData.append('Attestation', Attestation);
  
    // Afficher le contenu de FormData avant l'envoi
    formData.forEach((value, key) => {
      console.log(`Clé: ${key}, Valeur:`, value);
    });
  
    // Envoyer la requête HTTP
    return this.http.post<Depot>(`${this.baseUrl}/upload/${idDocument}`, formData);
  }
  

getDepotByDocumntId(id: number): Observable<Depot> {
  return this.http.get<Depot>(`${this.baseUrl}/depotByDocumentId/${id}`);
}
downloadDocuments(idDepot: number): Observable<Blob> {
  const url = `${this.baseUrl}/uploadzip/${idDepot}`;
  return this.http.get(url, {
    headers: new HttpHeaders(),
    responseType: 'blob',
  });
}
deleteDepot(idDepot: number): Observable<void> {
  const url = `${this.baseUrl}/${idDepot}`;
  return this.http.delete<void>(url);
}
updateRessource(id: number, Rapport: File, Journal: File, Attestation: File): Observable<Depot> {
  const formData = new FormData();
  formData.append('Rapport', Rapport);
  formData.append('Journal', Journal);
  formData.append('Attestation', Attestation);
  return this.http.put<Depot>(`${this.baseUrl}/${id}`, formData);
}

}
