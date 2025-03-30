// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
<<<<<<< HEAD
  isLogedIn():boolean{
=======
  isLoggedIn():boolean{
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
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


}
