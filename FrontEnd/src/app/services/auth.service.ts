// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private apiUrl = 'http://localhost:8222/auth'; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
  signUp(){}
  isLogedIn():boolean{
    if(localStorage.getItem('token'))
      return true;
    return false;
  }
  
  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, { token }).subscribe(response => {
        localStorage.removeItem('token');
        window.location.href="/sign-in";
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
  private baseUrl = 'http://localhost:8076';

    private getAuthHeaders() {
      const token = localStorage.getItem('token');
      console.log('Token envoyé:', token);

      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': ` Bearer ${token}`
    });}

  register1(userData: any): Observable<any> {
      console.log('📤 Données envoyées depuis AuthService:', userData);

      return this.http.post(`${this.baseUrl}/auth/register`, userData);
    }



    login1(credentials: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/auth/login`, credentials);
    }

  refreshToken(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/refresh`, { token });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forget-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password?token=${token}`, { password });
  }
  // 🔹 Nouvelle fonction pour récupérer les données utilisateur
  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Ajouter le token dans l'en-tête Authorization
    });
    return this.http.get(`${this.baseUrl}/adminuser/get-profile`, { headers });
  }
  

  storeUserRole(token: string) {
    const decodedToken: any = jwtDecode(token);
  
    const roles: string[] = decodedToken?.resource_access?.['praktika-Auth']?.roles || [];  
    if (roles.includes('USER')) {
      localStorage.setItem('userRole', 'USER');
    } else {
      localStorage.setItem('userRole', 'ADMIN');
    }
  }
  
}
