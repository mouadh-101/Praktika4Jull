import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Validators might be needed if we make files required
import { ActivatedRoute, Router } from '@angular/router'; // Added Router
import { Depot } from 'src/app/Models/Depot';
import { DepotService } from 'src/app/services/Document/Depot.service';

@Component({
  selector: 'app-Depot',
  templateUrl: './Depot.component.html',
  styleUrls: ['./Depot.component.css']
})
export class DepotComponent implements OnInit {
  
  depotId!: number; // This is actually the documentId
  uploadForm: FormGroup;
  messageType: 'success' | 'danger' = 'success';
  message: string | null = null;
  depots: Depot | null = null; // Initialize to null for clearer checks

  constructor(
    private formBuilder: FormBuilder,
    private depotService: DepotService,
    private route: ActivatedRoute,
    private router: Router // Injected Router
  ) {
    this.uploadForm = this.formBuilder.group({
      Rapport: [null], // Store File object or null
      Journal: [null],
      Attestation: [null]
      // No validators needed here as we check if at least one file is selected manually
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.depotId = +idParam; // This is the Document ID
      if (isNaN(this.depotId) || this.depotId <= 0) {
        console.error('Invalid Document ID provided for Depot.');
        this.message = 'Invalid document reference. Cannot load submission details.';
        this.messageType = 'danger';
        // Optionally navigate away: this.router.navigate(['/ListDocument']);
        return;
      }
      this.loadDepotData(); // Charger les dépôts existants
    } else {
      console.error('No Document ID found in route for Depot.');
      this.message = 'No document reference found. Cannot load submission details.';
      this.messageType = 'danger';
      // Optionally navigate away: this.router.navigate(['/ListDocument']);
    }
  }

  loadDepotData(): void {
    this.depotService.getDepotByDocumntId(this.depotId).subscribe({
      next: (data) => {
        console.log('Depot data:', data);
        if (data) { // API might return null or empty if no depot exists
          this.depots = data;
        } else {
          this.depots = null; // Ensure it's null if no data
        }
      },
      error: (err) => {
        // It's okay if a 404 happens (no depot yet), don't show as page error
        if (err.status !== 404) {
          console.error('Error fetching depot:', err);
          this.message = 'Error loading existing submission details.';
          this.messageType = 'danger';
        }
        this.depots = null; // Ensure it's null on error
      }
    });
  }

  onFileChanged(event: Event, field: string): void {
    const target = event.target as HTMLInputElement;
    if (target?.files?.length) {
      const file = target.files[0];
      console.log(`File selected for ${field}:`, file.name);
      this.uploadForm.patchValue({ [field]: file });
      this.uploadForm.get(field)?.markAsDirty(); // Mark as dirty to enable submit if needed
    } else {
      console.log(`No file selected for ${field}`);
      // this.uploadForm.patchValue({ [field]: null }); // Clear if selection was cancelled
    }
  }

  getFileName(field: string): string {
    const file = this.uploadForm.get(field)?.value;
    return file instanceof File ? file.name : '';
  }

  isAnyFileSelected(): boolean {
    return Object.values(this.uploadForm.value).some(value => value instanceof File);
  }

  onSubmit(): void {
    this.message = null; // Clear previous messages

    if (!this.isAnyFileSelected() && !this.depots) {
      this.message = 'Please select at least one file to create a new submission.';
      this.messageType = 'danger';
      return;
    }
     if (!this.isAnyFileSelected() && this.depots) {
      // If updating and no new files are selected, it implies no change to files.
      // Depending on backend, this might be an error or just no-op for files.
      // For now, we allow proceeding; backend should handle this.
      // A message could be shown if desired:
      // this.message = 'No new files selected for update. If you only want to change metadata (not applicable here), use a different form.';
      // this.messageType = 'info';
      // return; // Or allow to proceed
    }


    if (this.depotId) {
      const rapportFile = this.uploadForm.get('Rapport')?.value as File | null;
      const journalFile = this.uploadForm.get('Journal')?.value as File | null;
      const attestationFile = this.uploadForm.get('Attestation')?.value as File | null;

      if (this.depots && this.depots.idDepot) { // Update existing
        this.depotService.updateRessource(this.depots.idDepot, rapportFile, journalFile, attestationFile).subscribe({
          next: () => {
            this.messageType = 'success';
            this.message = 'Submission updated successfully!';
            this.loadDepotData(); // Refresh data
            this.uploadForm.reset(); // Reset form after successful upload
          },
          error: (error) => {
            this.messageType = 'danger';
            this.message = 'Error updating submission: ' + (error.error?.message || error.message);
            console.error('Error updating submission:', error);
          }
        });
      } else { // Add new submission
        this.depotService.addDocument(rapportFile, journalFile, attestationFile, this.depotId).subscribe({
          next: () => {
            this.messageType = 'success';
            this.message = 'Files submitted successfully!';
            this.loadDepotData(); // Refresh data
            this.uploadForm.reset(); // Reset form after successful upload
          },
          error: (error) => {
            this.messageType = 'danger';
            this.message = 'Error submitting files: ' + (error.error?.message || error.message);
            console.error('Error submitting files:', error);
          }
        });
      }
    } else {
      this.message = 'Document ID is missing. Cannot submit files.';
      this.messageType = 'danger';
      console.error('Formulaire invalide ou identifiant de dépôt manquant');
    }
  }

  download(depotId: number): void {
    if (!depotId) return;
    this.depotService.downloadDocuments(depotId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `depot_${depotId}_documents.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error downloading documents:', err);
        this.message = 'Error downloading documents. ' + (err.error?.message || err.message);
        this.messageType = 'danger';
      }
    });
  }

  onDelete(depotId: number): void {
    if (!depotId) return;
    if (confirm('Are you sure you want to delete this entire submission? This action cannot be undone.')) {
      this.depotService.deleteDepot(depotId).subscribe({
        next: () => {
          this.message = 'Submission deleted successfully.';
          this.messageType = 'success';
          this.depots = null; // Clear local data
          this.uploadForm.reset(); // Reset form
          // Optionally, navigate or refresh part of the page
          // this.router.navigate(['/ListDocument']); // Or stay on page
        },
        error: (err) => {
          console.error('Error deleting submission:', err);
          this.message = 'Error deleting submission. ' + (err.error?.message || err.message);
          this.messageType = 'danger';
        },
      });
    }
  }

  // updateFile method was redundant and removed.
  // isFileAlreadyUploaded and isFileAdded methods were simple checks for this.depots,
  // which is now handled directly in the template or by isAnyFileSelected for form state.
}