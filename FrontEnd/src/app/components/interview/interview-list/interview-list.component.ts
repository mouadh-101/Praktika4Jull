import { Component, OnInit } from '@angular/core';
import { Interview, InterviewService, InterviewStatus } from 'src/app/services/interview.service'; // Assuming InterviewStatus might be an enum
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For jsPDF plugin
import autoTable from 'jspdf-autotable'; // Import for autoTable function
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit {
  interviews: Interview[] = [];
  filteredInterviewsCache: Interview[] = []; // Cache for filtered results
  searchTerm: string = '';
  p: number = 1; // Current page for pagination
  itemsPerPage: number = 6; // Number of items per page, adjust as needed

  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Expose enum to template if needed for specific logic, though CSS classes handle styling now
  // public InterviewStatus = InterviewStatus; 

  constructor(
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.interviewService.getAllInterviews().subscribe({
      next: data => {
        this.interviews = data.map(interview => ({
          ...interview,
          // Ensure dateInterview is a Date object if needed by pipes or other logic
          dateInterview: interview.dateInterview ? new Date(interview.dateInterview) : new Date()
        }));
        this.filterInterviews(); // Apply initial (empty) filter
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading interviews:', err);
        this.errorMessage = 'Failed to load interviews. ' + (err.error?.message || err.message);
        this.isLoading = false;
      }
    });
  }

  filterInterviews(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredInterviewsCache = [...this.interviews];
    } else {
      this.filteredInterviewsCache = this.interviews.filter(interview =>
        (interview.titre?.toLowerCase().includes(term) || // Assuming 'titre' might exist or be added
         interview.location?.toLowerCase().includes(term) ||
         interview.notes?.toLowerCase().includes(term) ||
         interview.status?.toLowerCase().includes(term) ||
         (interview.candidateName?.toLowerCase().includes(term)) || // If candidate/company info is on Interview object
         (interview.companyName?.toLowerCase().includes(term))) 
      );
    }
    this.p = 1; // Reset pagination to first page
  }
  
  // This method is called by the template's *ngFor
  getFilteredInterviews(): Interview[] {
    // Call filterInterviews whenever searchTerm changes, directly in template or via (ngModelChange)
    // For simplicity, if just using searchTerm in pipe, it's fine.
    // If replacing pipe, ensure this method is efficient or memoized, or filter on demand.
    // The current HTML uses `getFilteredInterviews() | paginate`, so this method should just return the filtered list.
    // The actual filtering logic is now in `filterInterviews()`.
    // To trigger filtering when searchTerm changes:
    // In HTML: <input [(ngModel)]="searchTerm" (ngModelChange)="filterInterviews()" ... >
    // Then this method just returns the cache:
    return this.filteredInterviewsCache;
  }


  deleteInterview(id?: number): void { // id can be undefined if interviewId is optional
    if (id === undefined) {
      alert('Cannot delete: Interview ID is missing.');
      return;
    }
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewService.deleteInterview(id).subscribe({
        next: () => {
          this.loadInterviews(); // Recharger la liste après suppression
          alert('Interview deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting interview:', err);
          alert('Failed to delete interview. ' + (err.error?.message || err.message));
        }
      });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/interviews/add']);
  }

  navigateToEdit(id?: number): void {
    if (id === undefined) {
      alert('Cannot edit: Interview ID is missing.');
      return;
    }
    this.router.navigate(['/interviews/edit', id]);
  }

  navigateToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  // getStatusClass is no longer needed as CSS classes handle status styling directly.

  exportToPDF(): void {
    const doc = new jsPDF();
    const dataToExport = this.getFilteredInterviews(); // Export filtered data

    doc.setFontSize(18);
    doc.text("Scheduled Interviews", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Time', 'Location', 'Candidate/Company', 'Notes', 'Status', 'Link']],
      body: dataToExport.map(interview => [
        interview.dateInterview ? new Date(interview.dateInterview).toLocaleDateString() : 'N/A',
        interview.dateInterview ? new Date(interview.dateInterview).toLocaleTimeString() : 'N/A',
        interview.location || 'N/A',
        interview.candidateName || interview.companyName || 'N/A', // Adjust based on actual data
        interview.notes || 'N/A',
        interview.status || 'N/A',
        interview.interviewLink || 'N/A'
      ]),
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] } // Using primary color for header
    });

    doc.save("Interviews_Praktika.pdf");
    alert('Interviews exported to PDF successfully!');
  }

  exportToExcel(): void {
    const dataToExport = this.getFilteredInterviews().map(interview => ({
      ID: interview.interviewId,
      Date: interview.dateInterview ? new Date(interview.dateInterview).toLocaleDateString() : 'N/A',
      Time: interview.dateInterview ? new Date(interview.dateInterview).toLocaleTimeString() : 'N/A',
      Location: interview.location,
      Notes: interview.notes,
      Status: interview.status,
      MeetingLink: interview.interviewLink,
      Candidate: interview.candidateName, // Add if available
      Company: interview.companyName    // Add if available
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Interviews");
    XLSX.writeFile(wb, "Interviews_Praktika.xlsx");
    alert('Interviews exported to Excel successfully!');
  }
}
