import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './use-tab.component.html',
  styleUrls: ['./use-tab.component.css']
})
export class UseTabComponent implements OnInit {
  users: User[] = [];
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