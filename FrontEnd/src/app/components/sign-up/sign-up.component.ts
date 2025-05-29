// src/app/sign-up/sign-up.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  // errorMessage: string = ''; // Not currently used, could be used for server errors

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      role: ['Student', Validators.required] // Default role to 'Student'
    });
  }

  onSignUp(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched(); // Ensure validation messages are shown
      // alert('Please fill out all required fields correctly.'); // Optional: general alert
      return;
    }

    if (this.signupForm.valid) { // Redundant check, but safe
      console.log('Attempting to register with data:', this.signupForm.value);
      this.authService.register(this.signupForm.value).subscribe({
        next: () => {
          alert('Registered Successfully!'); // Consider replacing with a more integrated notification
          this.router.navigate(['/sign-in']); // Redirect after successful registration
        },
        error: err => {
          alert('Registration failed. Please try again. Error: ' + (err.error?.message || err.message));
          console.error('Registration error:', err);
          // Potentially set an error message to display in the template via app-warning-banner
          // this.errorMessage = err.error?.message || 'An unexpected error occurred.';
        }
      });
    }
  }

  navigateToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }
}