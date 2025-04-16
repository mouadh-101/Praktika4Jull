import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  showDropdown = false;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private userService:UserService,
    private router:Router
  ) {}
userRole:any
  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    this.isLoggedIn = this.authService.isLogedIn();
    if (this.isLoggedIn) {
      this.userService.getUser().subscribe({
        next: (data) => {
          this.userService.getUseremail(data).subscribe({
            next: (userData) => {
              this.user = userData;
              console.log("User ID:", this.user);
            }
          });
        },
        
        error: (err) => console.error('Failed to fetch user data', err)
      });
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onLogout() {
    localStorage.removeItem('token');
    window.location.href="/sign-in";
    this.isLoggedIn = false;
    
  }
}
