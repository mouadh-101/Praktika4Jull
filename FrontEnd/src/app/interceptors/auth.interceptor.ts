// src/app/interceptors/auth.interceptor.ts

import { Injectable, Type } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Adjust the path as needed

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the token from the AuthService
    const token = this.authService.getToken();

    if (token) {
      // Clone the request and add the Authorization header with the token
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'

        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle unauthorized errors (401)
        if (error.status === 401) {
          // Redirect to the login page if the user is not authenticated
          window.location.href = '/sign-in';
        }

        // Re-throw the error for other components to handle
        return throwError(() => new Error('An error occurred while processing your request'));
      })
    );
  }
}

