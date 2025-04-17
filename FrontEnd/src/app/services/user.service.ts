import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8222/api/users/'; // Adjust the URL as needed
  constructor(private http: HttpClient , private authService : AuthService) {}
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}userById`); // Fetch user data
  }

  

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Redirect to Sign In page if not authenticated
      window.location.href = '/sign-in';
    }
    return throwError(() => new Error('An error occurred while fetching users'));
  }
  
  
}
