// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8082/api/users'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    console.log("this is user: ",user);
    
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error during login:', error);
    return throwError(() => new Error('Login failed'));
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token); // Store the token in localStorage
    
  }
  saveRole(role:string):void{
    localStorage.setItem('role',role);
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Retrieve the token
  }
  getRole():string|null{
    return localStorage.getItem('role');
  }
  clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Clear the role on logout
  }

  logout(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, { token }).pipe(
      catchError((error: any) => {
        console.error('Error during logout:', error);
        alert('Logout failed. Please try again.');
        return throwError(() => error);  // Only throw if there's an actual error
      })
    );
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Check if the token exists
  }
  
}