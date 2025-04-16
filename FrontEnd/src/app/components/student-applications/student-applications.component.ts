import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service'; // Adjust import paths
import { AuthService } from 'src/app/services/auth.service'; // For user role

@Component({
  selector: 'app-student-applications',
  templateUrl: './student-applications.component.html',
  styleUrls: ['./student-applications.component.css']
})
export class StudentApplicationsComponent implements OnInit {

  userRole!: string;
  applications: any[] = [];
  p: number = 1; // Page number for pagination

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService, // Assuming you have AuthService to fetch user role
    private router: Router // Add this line
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || 'DefaultRole';

    // Fetch the applications based on the role
    if (this.userRole === 'Student') {
      this.fetchStudentApplications();
    } else if (this.userRole === 'Company') {
      this.fetchCompanyApplications();
    }
  }

  fetchStudentApplications(): void {
    // Call the service to fetch applications for the student
    this.applicationService.getStudentApplications().subscribe((applications: any) => {
      this.applications = applications;
    });
  }

  fetchCompanyApplications(): void {
    // Call the service to fetch applications for the company's internships
    this.applicationService.getCompanyApplications().subscribe((applications: any) => {
      this.applications = applications;
    });
  }

  viewApplicationDetails(applicationId: number): void {
    this.router.navigate(['/applications', applicationId]);
  }
}
