import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap'; // For Modal control
import { Internship } from 'src/app/models/internship'; // Ensure Internship model matches template usage
import { FavoriService } from 'src/app/services/favori.service';
import { InternshipService } from 'src/app/services/internship.service';
import { MatDialog } from '@angular/material/dialog'; // Not used if AddApplication is Bootstrap, but keeping if needed elsewhere
import { AddApplicationDialogComponent } from '../add-application/add-application.component';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from '../../services/chat.service';
import * as moment from 'moment'; // For getRelativeTime

@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.component.html',
  styleUrls: ['./internship-details.component.css']
})
export class InternshipDetailsComponent implements OnInit {
  internship!: Internship; // Use definite assignment assertion or initialize
  isFavori: boolean = false;
  users: any[] = []; // Consider a User model
  selectedUserId: string = '';
  userId!: string; // Logged-in user's ID

  private shareModalInstance: any; // To store Bootstrap modal instance

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Added Router
    private internshipService: InternshipService,
    private favorisService: FavoriService,
    private userService: UserService,
    private chatService: ChatService,
    private dialog: MatDialog // For AddApplicationDialogComponent
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam; // Convert string to number
      this.internshipService.getInternshipById(id).subscribe(data => {
        this.internship = data;
        // Assuming activelyHiring might be part of internship data, if not, remove from template or add to model
        // this.internship.activelyHiring = true; // Example placeholder
        if (this.userId && this.internship) {
          this.checkFavori(this.userId, this.internship.id);
        }
      });
    } else {
      // Handle error or redirect if ID is not present
      console.error('Internship ID not found in route parameters');
      this.router.navigate(['/internships']); // Example redirect
    }

    this.loadUsers();
    this.getUserid(); // Fetch logged-in user's ID
  }

  getUserid(): void {
    this.userService.getUserData().subscribe({
      next: (userData) => {
        if (userData && userData.userId) {
          this.userId = userData.userId;
          console.log('Logged-in User ID:', this.userId);
          this.chatService.connect(this.userId); // Connect to chat service
          // Check favori status after getting both userId and internship
          if (this.internship) {
            this.checkFavori(this.userId, this.internship.id);
          }
        } else {
          console.error('User ID not found in user data.');
        }
      },
      error: (error) => {
        console.error('Error fetching user ID:', error);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data.filter(user => user.userId !== this.userId); // Exclude self from share list
    });
  }

  openShareModal(): void {
    const modalElement = document.getElementById('shareModal');
    if (modalElement) {
      this.shareModalInstance = new bootstrap.Modal(modalElement);
      this.shareModalInstance.show();
    }
  }

  closeShareModal(): void {
    if (this.shareModalInstance) {
      this.shareModalInstance.hide();
    }
  }

  sendInternshipMessage(): void {
    if (!this.selectedUserId) {
      alert('Please select a user to share with.');
      return;
    }
    // Assuming internship URL can be constructed or is part of internship data
    const internshipUrl = `${window.location.origin}/internships/details/${this.internship.id}`;
    const messageData = {
      senderId: this.userId,
      receiverId: this.selectedUserId,
      content: `Check out this internship: **${this.internship.titre}** at **${this.internship.company?.name || this.internship.company?.description}**.\nDetails: ${internshipUrl}`
    };

    this.chatService.sendMessage(messageData);
    alert('Internship shared successfully via chat!');
    this.closeShareModal();
  }

  checkFavori(userId: string, internshipId: number): void {
    this.favorisService.checkFavori(userId, internshipId).subscribe({
      next: (response) => {
        this.isFavori = response; // Assuming response is boolean
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
      }
    });
  }

  toggleFavori(): void {
    if (!this.userId || !this.internship) {
      alert('User or Internship data not available. Please try again.');
      return;
    }

    if (this.isFavori) {
      this.favorisService.removeFavori(this.internship.id).subscribe({ // Assuming removeFavori takes internshipId
        next: () => {
          this.isFavori = false;
          console.log('Favorite removed successfully');
        },
        error: (error) => console.error('Error removing favorite:', error)
      });
    } else {
      this.favorisService.addFavoris(this.internship.id).subscribe({ // Assuming addFavoris takes internshipId
        next: () => {
          this.isFavori = true;
          console.log('Favorite added successfully');
        },
        error: (error) => console.error('Error adding favorite:', error)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/internships']); // Or use window.history.back();
  }

  onApplyClicked(internshipId: number | undefined): void {
    if (internshipId === undefined) {
      console.error('Internship ID is undefined. Cannot apply.');
      alert('Cannot apply for this internship due to missing ID.');
      return;
    }
    const dialogRef = this.dialog.open(AddApplicationDialogComponent, {
      width: '500px',
      data: { internshipId: internshipId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.action === 'create') { // Check for successful application creation
        console.log('Application submitted successfully', result.application);
        alert("Application submitted successfully!");
      } else {
        console.log('Application submission canceled or failed.');
      }
    });
  }

  getRelativeTime(date: string | undefined): string {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "Date not available";
    }
  }
}
