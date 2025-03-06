import { Component, ElementRef, OnInit } from '@angular/core';
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
    private userService:UserService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
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
  }
}
