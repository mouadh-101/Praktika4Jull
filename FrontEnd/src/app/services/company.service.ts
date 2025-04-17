import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
   private apiUrl='http://localhost:8222/api/internships/company'

    constructor(private http: HttpClient) {}
  updateProfile(user: any): Observable<any> {
      const forUser = this.http.put('http://localhost:8222/api/users', user);
      const forCompany = this.http.put(`${this.apiUrl}/update`, user);
    
      return forkJoin([forUser, forCompany]).pipe(
        catchError(this.handleError)
      );
    }
    
    getCompanyData(): Observable<any> {
      return this.http.get(`${this.apiUrl}`).pipe(
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
}
 