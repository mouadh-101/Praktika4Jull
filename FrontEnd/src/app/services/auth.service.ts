// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8222/auth'; 
  private userLastSeenUrl = 'http://localhost:8222/api/internships/user-last-seen';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
  signUp(){}
  
  isLoggedIn():boolean{
    if(localStorage.getItem('token'))
      return true;
    return false;
  }
  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, { token }).subscribe(response => {
        localStorage.removeItem('token');
        window.location.reload();
      }, error => {
        console.error('Error during logout', error);
      });
    }
  }
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  getToken()
  {
    return localStorage.getItem('token');
  }
  //for internship 
  updateLastSeen(userId: string): Observable<any> {
    return this.http.put(`${this.userLastSeenUrl}/${userId}`, {});
  }
 
  getLastSeen(userId: string): Observable<string> { // 🔥 Remplace LocalDateTime par string
    return this.http.get<string>(`${this.userLastSeenUrl}/${userId}`);
  }
  

}
