import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { MatDialog } from '@angular/material/dialog';
import { AddApplicationDialogComponent } from '../add-application/add-application.component';
import { Location } from '@angular/common'; // For goBack()
import { AuthService } from 'src/app/services/auth.service'; // To get user role

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

  application: any = null; // Initialize to null
  loading: boolean = true;
  error: string | null = null; // Initialize to null
  showMore: boolean = false; // For toggling detailed student profile
  userRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private dialog: MatDialog,
    private location: Location, // Injected Location
    private authService: AuthService // Injected AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      if (isNaN(id) || id <= 0) {
        this.error = 'Invalid application ID provided.';
        this.loading = false;
        return;
      }
      this.getApplicationDetails(id);
    } else {
      this.error = 'No application ID found in route.';
      this.loading = false;
    }
  }

  getApplicationDetails(id: number): void {
    this.loading = true;
    this.error = null;
    this.applicationService.getApplicationById(id).subscribe({
      next: (data:any) => {
        this.application = data;
        this.loading = false;
        console.log('Application Details:', this.application);
      },
      error: (err:any) => {
        this.error = 'Failed to load application details. ' + (err.error?.message || err.message);
        this.loading = false;
        console.error(err);
      }
    });
  }

  onUpdateApplication(appId: number | undefined): void {
    if (appId === undefined || !this.application) {
      alert('Application data is not available for update.');
      return;
    }
    const dialogRef = this.dialog.open(AddApplicationDialogComponent, {
      width: '600px',
      data: {
        // Pass data expected by AddApplicationDialogComponent
        id: appId, // Application ID
        internshipId: this.application.internship?.id, // Internship ID
        status: this.application.status,
        coverLetter: this.application.coverLetter,
        editMode: true,
      }
    });
  
    // No need for dialogRef.componentInstance.setFormData if dialog handles data in ngOnInit
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'update') {
        // Re-fetch details to show updated data
        this.getApplicationDetails(appId); 
        alert('Application updated successfully!');
      }
    });
  }

  onAnalyze(id: number | undefined): void {
    if (id === undefined) {
      alert('Application ID is missing, cannot perform analysis.');
      return;
    }
    this.router.navigate(['applicationsAnalyser', id]);
  }

  onDeleteApplication(appId: number | undefined): void {
    if (appId === undefined) {
      alert('Application ID is missing, cannot delete.');
      return;
    }
    if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      this.applicationService.deleteApplication(appId).subscribe({
        next: () => {
          alert('Application deleted successfully.');
          this.router.navigate(['/applications']); 
        },
        error: (err) => {
          console.error('Failed to delete application:', err);
          alert('Failed to delete application. ' + (err.error?.message || err.message));
        }
      });
    }
  }

  updateApplicationStatus(applicationId: number | undefined, status: 'ACCEPTED' | 'REJECTED'): void {
    if (applicationId === undefined) {
      alert('Application ID is missing, cannot update status.');
      return;
    }
    const confirmationMessage = `Are you sure you want to ${status.toLowerCase()} this application?`;
    if (confirm(confirmationMessage)) {
      this.applicationService.updateApplicationStatus(applicationId, status).subscribe({
        next: (updatedApplication) => {
          this.application = updatedApplication; // Update local data
          alert(`Application ${status.toLowerCase()} successfully.`);
        },
        error: (err) => {
          console.error(`Error updating application status to ${status}:`, err);
          alert(`Failed to ${status.toLowerCase()} application. ` + (err.error?.message || err.message));
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
