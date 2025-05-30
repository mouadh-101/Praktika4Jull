import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
// Chart.js is tree-shakable, so ensure necessary components are imported if not using 'auto'
// import { Chart } from 'chart.js/auto'; // Not strictly needed if using ChartType and BaseChartDirective

@Component({
  selector: 'app-student-applications',
  templateUrl: './student-applications.component.html',
  styleUrls: ['./student-applications.component.css']
})
export class StudentApplicationsComponent implements OnInit {

  userRole!: string;
  applications: any[] = [];
  p: number = 1; // Page number for pagination
  itemsPerPage: number = 6; // Adjusted for card layout, can be tuned

  stats: any = { total: 0, pending: 0, accepted: 0, rejected: 0 };
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Chart.js themed colors (approximating global CSS vars)
  // Ideally, these would be dynamically read from CSS variables if possible,
  // but that's complex. Hardcoding matching hex values is simpler for now.
  // --color-warning-bg: #ffc107; (Pending)
  // --color-success: #28a745; (Accepted)
  // --color-danger: #dc3545; (Rejected)
  // --color-primary: #0066cc; (Total - if charted)

  chartData: ChartData<'bar'> = { // Explicitly typed for 'bar' chart
    labels: ['Pending', 'Accepted', 'Rejected'], // Simplified labels
    datasets: [
      { 
        data: [0, 0, 0], 
        label: 'Application Status',
        backgroundColor: [
          'rgba(255, 193, 7, 0.6)',   // Warning (Pending) - approx --color-warning-bg
          'rgba(40, 167, 69, 0.6)',  // Success (Accepted) - approx --color-success
          'rgba(220, 53, 69, 0.6)'   // Danger (Rejected) - approx --color-danger
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = { // Explicitly typed for 'bar' chart
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal bar chart might be nice for few categories
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1 // Ensure y-axis shows whole numbers for counts
        }
      }
    },
    plugins: {
      legend: {
        display: false // Single dataset, legend might be redundant
      }
    }
  };
  chartType: ChartType = 'bar';


  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || 'DefaultRole'; // Fallback role
    this.loadDataBasedOnRole();
  }

  loadDataBasedOnRole(): void {
    this.isLoading = true;
    this.errorMessage = null;
    if (this.userRole === 'Student') {
      this.fetchStudentApplications();
      this.fetchStudentStats();
    } else if (this.userRole === 'Company') {
      this.fetchCompanyApplications();
    } else {
      this.errorMessage = "Unknown user role. Cannot display applications.";
      this.isLoading = false;
    }
  }

  fetchStudentApplications(): void {
    this.applicationService.getStudentApplications().subscribe({
      next: (applications: any[]) => {
        this.applications = applications;
        this.isLoading = false; // Stop loading after student apps are fetched (stats might still be loading)
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch your applications.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  fetchCompanyApplications(): void {
    this.applicationService.getCompanyApplications().subscribe({
      next: (applications: any[]) => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch company applications.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  fetchStudentStats(): void {
    this.applicationService.getApplicationStatistics().subscribe({
      next: (stats: any) => {
        this.stats = stats;
        // Update chart data directly
        this.chartData.datasets[0].data = [stats.pending, stats.accepted, stats.rejected];
        // No need to re-assign this.chartData unless structure changes
      },
      error: (err) => {
        // Don't set global error message for stats failure if applications loaded
        console.error('Failed to fetch application statistics:', err);
      }
    });
  }

  viewApplicationDetails(applicationId: number | undefined): void {
    if (applicationId === undefined) {
      console.error('Application ID is undefined');
      this.errorMessage = 'Cannot view details: Application ID is missing.';
      return;
    }
    this.router.navigate(['/applications', applicationId]);
  }

  withdrawApplication(applicationId: number | undefined): void {
    if (applicationId === undefined) {
      alert('Cannot withdraw: Application ID is missing.');
      return;
    }
    if (confirm('Are you sure you want to withdraw this application?')) {
      this.applicationService.withdrawApplication(applicationId).subscribe({
        next: () => {
          alert('Application withdrawn successfully.');
          // Refresh the list of applications
          this.fetchStudentApplications(); 
          // Optionally, also refresh stats
          this.fetchStudentStats(); 
        },
        error: (err) => {
          console.error('Error withdrawing application:', err);
          alert('Failed to withdraw application. ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
