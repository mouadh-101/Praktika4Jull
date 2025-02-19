import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8082/api/users/'; // Adjust the URL as needed

  constructor(private http: HttpClient , private authService : AuthService) {}
  getUsers(): Observable<User[]> {
    const token = this.authService.getToken(); // Get the token from AuthService
    if (!token) {
      return throwError(() => new Error('No token found. Please log in.'));
    }
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Redirect to Sign In page if not authenticated
      window.location.href = '/sign-in';
    }
    return throwError(() => new Error('An error occurred while fetching users'));
  }
  getUsernameFromToken(): string | null {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.preferred_username || decodedToken.email || decodedToken.sub || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  getUserInfo(): Observable<any> {
    const username = this.getUsernameFromToken();
    if (!username) {
      throw new Error('No username found in token');
    }
    
    return this.http.get<User>(`${this.apiUrl}/user/${username}`);
  }
}
