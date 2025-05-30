import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Added Router
import { Depot } from 'src/app/Models/Depot';
import { DepotService } from 'src/app/services/Document/Depot.service';

@Component({
  selector: 'app-DepotBack',
  templateUrl: './DepotBack.component.html',
  styleUrls: ['./DepotBack.component.css']
})
export class DepotBackComponent implements OnInit {

  depotId!: number; // This is the Document ID
  depots: Depot | null = null; // Initialize to null for clearer checks
  isLoading: boolean = true;
  message: string | null = null;
  messageType: 'success' | 'danger' | 'info' = 'info';

  constructor(
    private depotService: DepotService,
    private route: ActivatedRoute,
    private router: Router // Injected Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.depotId = +idParam;
      if (isNaN(this.depotId) || this.depotId <= 0) {
        console.error('Invalid Document ID provided for DepotBack view.');
        this.message = 'Invalid document reference. Cannot load submission details.';
        this.messageType = 'danger';
        this.isLoading = false;
        // Optionally navigate away or rely on user clicking "Back"
        // this.router.navigate(['/DocumentBack']);
        return;
      }
      this.loadDepotData();
    } else {
      console.error('No Document ID found in route for DepotBack view.');
      this.message = 'No document reference found. Cannot load submission details.';
      this.messageType = 'danger';
      this.isLoading = false;
      // this.router.navigate(['/DocumentBack']);
    }
  }

  loadDepotData(): void {
    this.isLoading = true;
    this.message = null;
    this.depotService.getDepotByDocumntId(this.depotId).subscribe({
      next: (data) => {
        if (data) {
          this.depots = data;
        } else {
          this.depots = null; // No submission found for this document ID
          this.message = `No submission found for Document ID: ${this.depotId}.`;
          this.messageType = 'info';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching depot details:', err);
        if (err.status === 404) {
          this.depots = null;
          this.message = `No submission found for Document ID: ${this.depotId}. The student may not have submitted any files yet.`;
          this.messageType = 'info';
        } else {
          this.message = 'Error loading submission details. ' + (err.error?.message || err.message);
          this.messageType = 'danger';
        }
        this.isLoading = false;
      }
    });
  }

  download(depotId: number | undefined): void {
    if (!depotId) {
      this.message = 'Cannot download: Depot ID is missing.';
      this.messageType = 'danger';
      return;
    }
    this.message = null; // Clear previous messages
    // Optionally show a "downloading..." message
    this.depotService.downloadDocuments(depotId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submission_doc_${this.depotId}_depot_${depotId}.zip`; // More specific filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.message = 'Documents downloaded successfully as a ZIP file.';
        this.messageType = 'success';
      },
      error: (err) => {
        console.error('Error downloading documents:', err);
        this.message = 'Error downloading documents. ' + (err.error?.message || err.message);
        this.messageType = 'danger';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/DocumentBack']); // Navigates to the admin list of documents
  }
}
