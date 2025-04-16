import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Diplome {
  id: number;
  dateObtention: string;  
  formation: any;  
  user: any; 
  path:any
}

@Injectable({
  providedIn: 'root',
})
export class DiplomeService {
  private baseUrl = `http://localhost:8086/api/diplomes`; // Ensure that `environment.apiUrl` points to the correct API URL

  constructor(private http: HttpClient) {}

  getAllDiplomes(): Observable<Diplome[]> {
    return this.http.get<Diplome[]>(this.baseUrl);
  }

  getDiplomeById(id: number): Observable<Diplome> {
    return this.http.get<Diplome>(`${this.baseUrl}/${id}`);
  }

  createDiplome(diplome: any,idformation:number,iduser:number): Observable<Diplome> {
    return this.http.post<Diplome>(this.baseUrl+"?idformation="+idformation+"&iduser="+iduser, diplome);
  }

  updateDiplome(id: number, diplome: Diplome): Observable<Diplome> {
    return this.http.put<Diplome>(`${this.baseUrl}/${id}`, diplome);
  }

  deleteDiplome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  generateDiploma(diplomaId: number, userId: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/generate/${diplomaId}/${userId}`,{ responseType:'text' as 'json' });
  }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8086/api/examens/users");
  }

}
