// src/app/components/sign-in/sign-in.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup; // Declare the form group

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
  
      this.authService.login(email, password).subscribe(
        (response: any) => {
          console.log("Login response:", response);
  
          // Check if response contains a valid token
          if (!response.token || response.token === "invalid Cridentiel") {
            alert("Invalid credentials!");
            return;
          }
  
          // Save the token
          this.authService.saveToken(response.token);
          this.authService.saveRole(response.role);
          alert("Login successful!");
        },
        (error) => {
          console.error("Login error:", error);
          alert(error.error?.message || "Login failed. Please try again.");
        }
      );
    } else {
      alert("Please fill out all required fields correctly.");
    }
  }
  
  
}