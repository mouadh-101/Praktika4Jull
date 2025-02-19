import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userRole: string | null = null; // Store the user's role
  isLoggedIn: boolean = false;   // Track login status
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.updateUserStatus();
  }
  updateUserStatus(): void {
    this.userRole = this.authService.getRole(); // Get the role from AuthService
    this.isLoggedIn = this.authService.isLoggedIn(); // Check if the user is logged in
  }
  logout(): void {
    const token = localStorage.getItem('token'); // Retrieve token from storage
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    this.authService.logout(token).subscribe(
      (response) => {
        console.log("logout respons :",response);
        this.authService.clearStorage();
        this.updateUserStatus();
        alert('Logout successful!');
        window.location.href = '/sign-in'; 
      },
      (error) => {
        alert('Logout failed: ' + error.message);
      }
    );
  }
  

}
