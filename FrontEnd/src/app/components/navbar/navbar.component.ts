import { Component, ElementRef, OnInit, HostListener } from '@angular/core'; // Added HostListener
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null; // Consider defining a User interface
  showDropdown = false;
  userRole = '';

  notificationCount: number = 0;
  notificationsVisible: boolean = false;
  notifications: any[] = []; // Consider defining a Notification interface

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.fetchUserDetails();
      } else {
        this.user = null; // Clear user data on logout
        this.userRole = '';
      }
    });
    // Initial check
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.fetchUserDetails();
    }


    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
      this.notificationCount = notifications.length;
    });

    if (this.isLoggedIn) { // Connect to WebSocket only if logged in
      this.notificationService.connectToWebSocket();
    }
  }

  fetchUserDetails(): void {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.user = data;
        this.userRole = data.role; // Assuming role is part of user data
        localStorage.setItem('userRole', data.role); // Still useful for non-Angular parts?
        console.log('User data fetched for navbar:', this.user);
        console.log('User role:', this.userRole);
      },
      error: (err) => console.error('Failed to fetch user data', err)
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.showDropdown && !this.elementRef.nativeElement.querySelector('.dropdown-profile')?.contains(event.target)) {
      this.showDropdown = false;
    }
    // Close notifications popup if clicked outside (similar logic)
    if (this.notificationsVisible && !this.elementRef.nativeElement.querySelector('.notification-area')?.contains(event.target) && !this.elementRef.nativeElement.querySelector('.notifications-popup-container')?.contains(event.target)) {
      this.notificationsVisible = false;
    }
  }


  toggleNotifications(): void {
    this.notificationsVisible = !this.notificationsVisible;
    if (this.notificationsVisible) {
      // Potentially mark notifications as read or clear count here
      // For now, just toggles visibility
    }
  }

  onLogout(): void {
    this.authService.logout();
    // isLoggedIn status will be updated via isLoggedIn$ subscription
    this.showDropdown = false; // Hide dropdown after logout
    this.router.navigate(['/sign-in']);
  }

  navigateToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }

  // getUserRole() - combined into fetchUserDetails as role should come with user data
}