// src/app/components/sign-in/sign-in.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../services/user.service';
// Removed Observable import as it's not explicitly used after recent Angular versions for basic HttpClient

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  userId!: string; // Consider if this is truly needed here or if it's part of a post-login flow handled elsewhere

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required] // Add other validators like Validators.minLength(6) if needed
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to display validation messages
      this.loginForm.markAllAsTouched();
      // Optionally, display a general alert or use a snackbar/toast message
      // alert("Please fill out all required fields correctly.");
      return;
    }

    if (this.loginForm.valid) { // This check is somewhat redundant due to the invalid check above, but good practice
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          // alert("Login successful!"); // Consider replacing alerts with a more integrated notification system
          localStorage.setItem('token', response.token);
          sessionStorage.setItem('username', this.loginForm.value.email); // Storing email as username

          this.getUseridAndProceed(); // Centralize user ID fetching and subsequent actions
        },
        error: (error) => {
          alert("Invalid credentials. Please try again."); // For user feedback
          console.error('Login error:', error);
          // Potentially display error message in the form using app-warning-banner or similar
        }
      });
    }
  }

  getUseridAndProceed(): void {
    this.userService.getUserData().subscribe({
      next: (userData) => {
        if (userData && userData.userId) {
          this.userId = userData.userId;
          // Update last seen only if userId is successfully fetched
          this.authService.updateLastSeen(this.userId).subscribe({
            next: () => console.log('Last seen updated successfully.'),
            error: (err) => console.error('Error updating last seen:', err)
          });
        } else {
          console.warn('User ID not found in user data response.');
        }
        // Navigate after attempting to get user ID and update last seen, regardless of its success for now
        this.router.navigate(['/internships']);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du ID utilisateur:', error);
        // Still navigate, as login was successful. Last seen update is secondary.
        this.router.navigate(['/internships']);
      }
    });
  }

  navigateToForgotPassword(): void {
    // Implement navigation to forgot password page or open a dialog
    console.log('Navigate to Forgot Password');
    // this.router.navigate(['/forgot-password']); // Example navigation
    alert('Forgot Password functionality not yet implemented.');
  }

  navigateToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }
}
