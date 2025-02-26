import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8222/api/forum'; // URL de l'API Spring Boot

  constructor(private http: HttpClient) {}

  // Ajouter un post
  addPost(post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ajouterPost`, post);
  }

  // Récupérer tous les posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/post_list`);
  }

  // Supprimer un post
  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletepost/${id}`);
  }

  // Mettre à jour un post
  updatePost(id: number, post: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatePost/${id}`, post);
  }
}

