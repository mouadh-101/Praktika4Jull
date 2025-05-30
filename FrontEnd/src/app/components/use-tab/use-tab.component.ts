import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service'; // Assuming User interface/type exists

@Component({
  selector: 'app-user-table', // Selector indicates it's a user table
  templateUrl: './use-tab.component.html',
  styleUrls: ['./use-tab.component.css']
})
export class UseTabComponent implements OnInit { // Class name "UseTabComponent" is a bit misleading
  users: User[] = []; // Typed users array
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Pagination (currently commented out in HTML)
  // page: number = 1;
  // itemsPerPage: number = 10; // Example value

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.userService.getUsers().subscribe({
      next: (data: User[]) => { // Type the data
        this.users = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to load users. ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  // Placeholder for future actions if buttons are added to the table
  // editUser(userId: string): void {
  //   console.log('Edit user:', userId);
  //   // this.router.navigate(['/admin/users/edit', userId]);
  // }

  // deleteUser(userId: string): void {
  //   if (confirm('Are you sure you want to delete this user?')) {
  //     console.log('Delete user:', userId);
  //     // this.userService.deleteUser(userId).subscribe(...)
  //   }
  // }
}