import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder } from '@angular/forms'; // FormGroup, Validators might not be needed here
import { ProfileUpdateComponent } from '../profile-update/profile-update.component'; // Changed import

interface Internship {
  id: number;
  title: string;
  location: string;
  summary: string;
}

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  userData: any = {};
  companyData: any = {}; // Renamed from studentData for clarity
  isOwnProfile: boolean = true; // Assume true for now, logic to determine this can be added later

  // Placeholder for internships - this would typically be fetched from a service
  internships: Internship[] = [
    // { id: 1, title: 'Software Engineering Intern', location: 'San Francisco, CA', summary: 'Work on exciting projects using cutting-edge technology. This is a great opportunity to learn and grow with our talented team of engineers.' },
    // { id: 2, title: 'Marketing Intern', location: 'New York, NY', summary: 'Assist our marketing team with campaigns, social media, and market research. Gain hands-on experience in a fast-paced environment.' }
  ];

  constructor(
    private companyService: CompanyService, // Corrected spelling from campaonyservcie
    private userService: UserService,
    public dialog: MatDialog,
    private fb: FormBuilder // Keep if EditProfileDialogComponent or other forms need it
  ) {}

  ngOnInit(): void {
    this.fetchUserData();
    // In a real scenario, you might fetch internships related to the company here
  }

  fetchUserData(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in.');
      // Potentially set isOwnProfile to false or redirect
      return;
    }
    this.userService.getUserData().subscribe({
      next: (userData) => {
        this.userData = userData;
        console.log('User data fetched for company contact:', userData);
        // Assuming companyService.getCompanyData() fetches data for the logged-in company user
        this.companyService.getCompanyData().subscribe({
          next: (companyDetails) => {
            this.companyData = companyDetails;
            console.log('Company data fetched:', companyDetails);
            // TODO: Fetch actual internships for this company
            // For now, using placeholder or an empty array
            // this.fetchCompanyInternships(this.companyData.id);
          },
          error: (error) => console.error('Error fetching company data:', error)
        });
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        // Potentially set isOwnProfile to false
      }
    });
  }

  onUpdateProfile(): void {
    console.log('Updating company profile...');
    // Pass companyData, userData, and the company's ID.
    // ProfileUpdateComponent expects 'id' for the entity being updated.
    // It also uses fields from both companyData (e.g. industry, website) and userData (e.g. email, phone)
    // and distinguishes them using the isCompanyProfile flag.
    const dialogData = {
      ...this.userData,       // provides email, phone, address (common)
      ...this.companyData,    // provides name (as company name), bio (as description), profilePic (as logo), industry, website
      id: this.companyData.id, // Crucial: ID of the company entity to update
      isCompanyProfile: true
    };

    const dialogRef = this.dialog.open(ProfileUpdateComponent, {
      width: '600px', // ProfileUpdateComponent might be wider
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result) => { // result might have {action: 'update', profile: updatedProfile}
      if (result && result.action === 'update') { // Check if dialog returned a successful update
        this.fetchUserData(); // Refresh data
      }
    });
  }

  viewInternshipDetails(internshipId: number): void {
    console.log('View details for internship ID:', internshipId);
    // Navigate to internship details page, e.g.,
    // this.router.navigate(['/internships', internshipId]);
  }

  onPostNewInternship(): void {
    console.log('Navigate to post new internship page/dialog');
    // Open a dialog or navigate to a new route for posting internships
    // Example:
    // const dialogRef = this.dialog.open(PostInternshipDialogComponent, { width: '600px' });
    // dialogRef.afterClosed().subscribe(result => { if (result) { this.fetchCompanyInternships(); } });
  }
}
