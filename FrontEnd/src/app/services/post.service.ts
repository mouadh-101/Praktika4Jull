import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8222/api/forum'; 

  constructor(private http: HttpClient) {}

  // Ajouter un post
  addPost(post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ajouterPost`, post,{responseType:'text'});
  }

  // Récupérer tous les posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/post_list`);
  }
  getPostspage(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/post_list?page=${page}&size=${size}`);
  }
  filterPosts(name?: string, date?: string): Observable<any> {
    let params: any = {};
    if (name) params.name = name;
    if (date) params.date = date;

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }
  // Supprimer un post
  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletepost/${id}`,{responseType:'text'});
  }

  // Mettre à jour un post
  updatePost(id: number, post: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updatePost/${id}`, post,{responseType:'text'});
  }
}

