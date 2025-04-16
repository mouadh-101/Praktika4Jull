import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:8086/api/likes';

  constructor(private http: HttpClient) {}

  toggleLike(postId: number, userId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${postId}/user/${userId}`, {},{responseType:'text' as 'json'});
  }

  getLikeCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${postId}/count`);
  }
}
