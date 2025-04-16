import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Adjust the path as needed

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
        // Catch the error and log it
        console.error('Auth Interceptor caught error:', error);

        // Handle unauthorized errors (401)
        if (error.status === 401) {
          window.location.href = '/sign-in'; // Redirect to login page if unauthenticated
        }

        // Handle other errors gracefully
        if (error.status >= 400) {
          // This can be adjusted as per your needs, but you can log/notify users for other HTTP status codes
          return throwError(() => new Error('An error occurred while processing your request.'));
        }

        // For status 2xx or other non-error responses, continue as normal
        return throwError(() => error); // Re-throw the error if it's not handled above
      })
    );
  }
}
