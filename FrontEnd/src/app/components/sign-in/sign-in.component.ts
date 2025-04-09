// src/app/components/sign-in/sign-in.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup; // Declare the form group
  userId!: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService:AuthService,
    private userService:UserService

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
          localStorage.setItem('token', response.token);
          sessionStorage.setItem('username', this.loginForm.value.email);

        this.router.navigate(['/internships']);

          // 🔥 Récupérer l'ID utilisateur avant de mettre à jour la dernière connexion
          this.getUserid();
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
  getUserid(): void {
    this.userService.getUserData().subscribe(
      (userData) => {
        this.userId = userData.userId;

        // ✅ Une fois l'ID récupéré, mise à jour de la dernière connexion
        if (this.userId) {
          this.authService.updateLastSeen(this.userId).subscribe();
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du ID utilisateur', error);
      }
    );
  }



}
