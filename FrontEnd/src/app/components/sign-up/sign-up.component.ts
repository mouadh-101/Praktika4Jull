// src/app/sign-up/sign-up.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { User, Role } from '../../models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      role: ['STUDENT', Validators.required]
    });
  }

  onSignUp(): void {
    if (this.signupForm.valid) {
      const roleValue = this.signupForm.value.role as keyof typeof Role;
      const user: User = {
        ...this.signupForm.value,
        role: Role[roleValue]
      };
      console.log('Sending data:', user);
      this.authService.register(user).subscribe(
        () => {
          alert('Registration successful!');
          this.router.navigate(['/sign-in']);
        },
        (error) => {
          console.error(error);
          alert('Registration failed!');
        }
      );
    }
  }
}