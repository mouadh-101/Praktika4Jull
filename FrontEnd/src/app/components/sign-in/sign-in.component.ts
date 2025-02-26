// src/app/components/sign-in/sign-in.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup; // Declare the form group

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({ // Initialize the form group
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          alert("Login successful!");
          localStorage.setItem('token', response.token); // Store token if needed
          this.router.navigate(['/dashboard']); // Navigate to dashboard
        },
        error: (error) => {
          alert("Invalid credentials. Please try again.");
          console.error(error);
        }
      });
    } else {
      alert("Please fill out all required fields correctly.");
    }
  }
  
  
  
}