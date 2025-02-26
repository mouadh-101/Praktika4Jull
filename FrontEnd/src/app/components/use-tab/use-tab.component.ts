import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './use-tab.component.html',
  styleUrls: ['./use-tab.component.css']
})
export class UseTabComponent implements OnInit {
  users: any[] = [];
  isLoading = true; // Track loading state

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.isLoading = false; // Loading complete
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false; // Loading failed
      }
    );
  }
}