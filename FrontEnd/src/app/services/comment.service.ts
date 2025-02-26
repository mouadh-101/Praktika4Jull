import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Définition de l'interface Comment
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'http://localhost:8222/api/forum'; // Remplace cette URL par celle de ton backend

  constructor(private http: HttpClient) { }

  // Ajouter un commentaire à un post
  addComment(id: number, comment: any): Observable<Comment> {
    return this.http.post<any>(`${this.apiUrl}/ajouterComment/${id}`, comment);
  }

  // Récupérer tous les commentaires
  getComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comment_list`);
  }

  // Supprimer un commentaire
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteComment/${id}`);
  }

  // Mettre à jour un commentaire
  updateComment(id: number, comment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateComment/${id}`, comment);
  }
}
