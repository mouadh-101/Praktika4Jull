import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  showDropdown = false;
  userRole='';

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private userService:UserService,
    private router: Router
  ) {}

  ngOnInit() {
    
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getUserRole();
      this.userService.getUserData().subscribe({
        next: (data) => this.user = data,
        error: (err) => console.error('Failed to fetch user data', err)
        
      });
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/sign-in']);
    
  }
  getUserRole() {
    this.userService.getUserData().subscribe(
      (userData) => {
        this.userRole = userData.role; 
        console.log('Rôle de l\'utilisateur:', this.userRole);
      },
      (error) => {
        console.error('Erreur lors de la récupération du rôle utilisateur', error);
      }
    );
  }
}