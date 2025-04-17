import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service'; // Adjust import paths
import { AuthService } from 'src/app/services/auth.service'; // For user role
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-student-applications',
  templateUrl: './student-applications.component.html',
  styleUrls: ['./student-applications.component.css']
})
export class StudentApplicationsComponent implements OnInit {

  userRole!: string;
  applications: any[] = [];
  p: number = 1; // Page number for pagination
  stats: any = { total: 0, pending: 0, accepted: 0, rejected: 0 };

  // Chart Data
  chartData: ChartData = {
    datasets: [
      { data: [], label: 'Pending Applications' },
      { data: [], label: 'Accepted Applications' },
      { data: [], label: 'Rejected Applications' }
    ],
    labels: ['Applications Status']
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  chartType: ChartType = 'bar';

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
      this.fetchStudentStats(); // Fetch statistics for the chart
    } else if (this.userRole === 'Company') {
      this.fetchCompanyApplications();
    }
  }

  fetchStudentApplications(): void {
    // Call the service to fetch applications for the student
    this.applicationService.getStudentApplications().subscribe((applications: any) => {
      this.applications = applications;
      console.log(this.applications);
    });
  }

  fetchCompanyApplications(): void {
    // Call the service to fetch applications for the company's internships
    this.applicationService.getCompanyApplications().subscribe((applications: any) => {
      this.applications = applications;
    });
  }

  fetchStudentStats(): void {
    // Fetch statistics for the chart (total, pending, accepted, rejected)
    this.applicationService.getApplicationStatistics().subscribe((stats: any) => {
      // Assuming the stats format: { total, pending, accepted, rejected }
      this.stats = stats;
      this.chartData.datasets[0].data = [stats.pending];
      this.chartData.datasets[1].data = [stats.accepted];
      this.chartData.datasets[2].data = [stats.rejected];
    });
  }

  viewApplicationDetails(applicationId: number): void {
    this.router.navigate(['/applications', applicationId]);
  }
}
