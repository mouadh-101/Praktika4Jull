import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriService {
  private apiUrl = 'http://localhost:8222/api/internships/favori';
constructor(private http: HttpClient) { }

addFavoris(userId: string, internshipId: number): Observable<any> {
  // Construire l'URL en ajoutant l'ID du stage dans le chemin
  const url = `${this.apiUrl}/addFavori/${internshipId}`;

  // Créer un objet Favoris avec les données nécessaires (ex : userId et internshipId)
  const favorisData = {
    userId: userId,
    internshipId: internshipId
  };

  return this.http.post<any>(url, favorisData);
}

removeFavori(userId: string, internshipId: number) {
  return this.http.delete(`${this.apiUrl}/removeFavori/${internshipId}/${userId}`);
}


// Méthode pour vérifier si un favori existe
checkFavori(userId: string, internshipId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/checkFavori/${internshipId}/${userId}`);
}

 // Récupérer les stages favoris par userId
 getFavorisByUserId(userId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/favorisByUser/${userId}`);
}

}
