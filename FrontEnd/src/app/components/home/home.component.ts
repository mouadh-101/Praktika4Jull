import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service'; // Assuming you have UserService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string | null = null; // Student, Company, or null

  constructor(
    private authService: AuthService,
    private userService: UserService // Inject UserService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.userService.getUserData().subscribe({
        next: (userData) => {
          if (userData && userData.role) {
            this.userRole = userData.role;
          }
        },
        error: (err) => {
          console.error('Error fetching user data on home page:', err);
          // Potentially handle error, e.g. if role is crucial for display
        }
      });
    }

    // Also subscribe to login status changes if the user logs in/out while on the home page
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        this.userService.getUserData().subscribe({
          next: (userData) => {
            if (userData && userData.role) {
              this.userRole = userData.role;
            }
          },
          error: (err) => {
            console.error('Error fetching user data after login status change:', err);
          }
        });
      } else {
        this.userRole = null;
      }
    });
  }
}
