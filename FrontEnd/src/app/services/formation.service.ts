import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export class Formation {
  id!: number;
  titre!: string;
  description!: string;
  niveau!: number;
  formationT!:string 
  
}


@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:8086/api/formations'; // L'URL de votre backend

  constructor(private http: HttpClient) {}

  getmoyenneusers(id:number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/"+id+"/users-moyennes");
  }


  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }
  getAllFormationsuser(number:any): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl+"/buuser/"+number);
  }
  getAllFormationrecommandation(number:any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/recommendations/"+number);
  }
  assignUserToFormation(formationId: number, userId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${formationId}/assign/${userId}`, {},{responseType:'text' as 'json'});
  }
  assignUserToFormationrecommandation(formationId: any, userId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/assign/${userId}`, formationId,{responseType:'text' as 'json'});
  }
  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  updateFormation(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
  }

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
