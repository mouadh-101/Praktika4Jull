import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  ngOnInit(): void {
    this.logout();
  }
  constructor(private authService: AuthService) {}
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
        alert('Logout successful!');
        window.location.href = '/sign-in'; 
      },
      (error) => {
        alert('Logout failed: ' + error.message);
      }
    );
  }
}
