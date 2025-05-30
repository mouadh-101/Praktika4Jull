import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriService } from 'src/app/services/favori.service';
import { Internship } from 'src/app/models/internship'; // Assuming FavoriService returns Internship-like objects
import { AuthService } from 'src/app/services/auth.service'; // To get current user ID
import * as moment from 'moment'; // For relativeTime

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css']
})
export class FavorisComponent implements OnInit {
  favoris: Internship[] = []; // Typed as Internship[]
  userId: string | null = null; // Will be fetched from AuthService

  isLoading: boolean = true;
  errorMessage: string | null = null;
  p: number = 1; // Current page for pagination
  itemsPerPage: number = 6; // Number of items per page

  constructor(
    private router: Router,
    private favoriService: FavoriService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Assuming AuthService has a method to get current user's ID
    if (this.userId) {
      this.getFavorisByUserId(this.userId);
    } else {
      this.errorMessage = "User not identified. Cannot load favorites.";
      this.isLoading = false;
      // console.error('User ID not available from AuthService.');
      // Potentially redirect to login or show a more prominent error
    }
  }

  getFavorisByUserId(userId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.favoriService.getFavorisByUserId(userId).subscribe({
      next: (data: Internship[]) => { // Assuming data is Internship[]
        this.favoris = data.map(internship => ({
          ...internship,
          relativeTime: this.getRelativeTime(internship.createAt) // Calculate relativeTime
        }));
        console.log('Favorite internships fetched:', this.favoris);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching favorites:', error);
        this.errorMessage = 'Failed to load favorite internships. ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  goToDetails(id: number | undefined): void {
    if (id === undefined) {
      console.error('Internship ID is undefined');
      this.errorMessage = 'Cannot view details: Internship ID is missing.';
      return;
    }
    this.router.navigate(['/internships/details', id]);
  }

  removeFavorite(internshipId: number | undefined): void {
    if (internshipId === undefined || !this.userId) {
      alert('Cannot remove favorite: Missing internship ID or user ID.');
      return;
    }
    if (confirm('Are you sure you want to remove this internship from your favorites?')) {
      // Assuming removeFavori takes userId and internshipId, or just favoriteId if that's how it works
      // The current favoriService.removeFavori(id) in studentProfileComponent seems to take a favorite entry ID, not internshipId.
      // This might need adjustment based on actual favoriService implementation.
      // For now, let's assume it needs the internshipId and the service handles finding the specific favorite entry.
      // A more robust way would be if the `favoris` array items had a specific `favoriteId`.
      
      // Option 1: If service can remove by internshipId and userId (preferred if available)
      this.favoriService.removeFavoriByInternshipIdAndUserId(this.userId, internshipId).subscribe({
        next: () => {
          this.favoris = this.favoris.filter(internship => internship.id !== internshipId);
          alert('Removed from favorites.');
           if (this.favoris.length === 0) {
            // Optional: Show a message or handle empty state
          }
        },
        error: (err) => {
          console.error('Error removing favorite:', err);
          alert('Failed to remove favorite. ' + (err.error?.message || err.message));
        }
      });

      // Option 2: If `this.favoris` items have a unique `favoriteId` and service uses that.
      // const favoriteEntry = this.favoris.find(fav => fav.internship.id === internshipId); // Example if nested
      // if (favoriteEntry && favoriteEntry.id) { // Assuming favoriteEntry.id is the actual favorite record ID
      //   this.favoriService.removeFavori(favoriteEntry.id).subscribe({ ... });
      // }
    }
  }
  
  getRelativeTime(date: string | Date | undefined): string {
    if (!date) return '';
    return moment(date).fromNow();
  }
}
