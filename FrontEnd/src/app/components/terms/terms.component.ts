import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; // Added ViewChild, ElementRef
import { Terms } from 'src/app/core/model/db'; // Convention removed as unused
import { TermsService } from "../../services/terms.service";
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import * as bootstrap from 'bootstrap'; // Import bootstrap for modal control

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  @ViewChild('termModal') termModalElement!: ElementRef; // For Bootstrap modal instance

  termsList: Terms[] = [];
  
  currentTerm: Terms = this.resetCurrentTerm(); // For add/edit form
  editMode: boolean = false;
  termModalInstance: any; // Bootstrap modal instance

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private termsService: TermsService, private router: Router) {}

  ngOnInit(): void {
    this.loadTerms();
  }

  ngAfterViewInit(): void { // Initialize modal instance after view is ready
    if (this.termModalElement) {
      this.termModalInstance = new bootstrap.Modal(this.termModalElement.nativeElement);
    }
  }

  resetCurrentTerm(): Terms {
    return { termId: undefined, title: '', description: '' }; // termId undefined for new term
  }

  loadTerms(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.termsService.getAllTerms().subscribe({
      next: (data) => {
        this.termsList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading terms:', err);
        this.errorMessage = 'Failed to load terms. ' + (err.error?.message || err.message);
        this.isLoading = false;
      }
    });
  }

  deleteTerm(termId: number | undefined): void {
    if (termId === undefined) {
      console.error('Term ID is undefined for delete.');
      alert('Cannot delete: Term ID is missing.');
      return;
    }

    if (confirm('Are you sure you want to delete this term?')) {
      this.termsService.deleteTerm(termId).subscribe({
        next: () => {
          this.loadTerms();  // Recharger la liste après suppression
          alert('Term deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting term:', err);
          alert('Failed to delete term. ' + (err.error?.message || err.message));
        }
      });
    }
  }

  prepareAddTerm(): void {
    this.editMode = false;
    this.currentTerm = this.resetCurrentTerm();
    this.termModalInstance?.show();
  }

  prepareEditTerm(term: Terms): void {
    this.editMode = true;
    this.currentTerm = { ...term }; // Create a copy to avoid modifying list directly
    this.termModalInstance?.show();
  }
  
  closeTermModal(): void {
    this.termModalInstance?.hide();
  }

  onSubmitModalForm(termForm: NgForm): void {
    if (termForm.invalid) {
      alert('Please correct the errors in the form.');
      // Mark all as touched if using Reactive Forms, for template-driven, Angular does it on submit attempt
      Object.values(termForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    if (this.editMode) { // Update existing term
      if (this.currentTerm.termId === undefined) {
        console.error("Cannot update term: ID is undefined.");
        alert("Error: Cannot update term without a valid ID.");
        return;
      }
      this.termsService.updateTerm(this.currentTerm).subscribe({
        next: (response: Terms) => {
          alert('Term updated successfully!');
          this.loadTerms();
          this.closeTermModal();
        },
        error: (error: any) => {
          alert('Error updating term. ' + (error.error?.message || error.message));
          console.error('Error updating term:', error);
        }
      });
    } else { // Add new term
      this.termsService.addTerms(this.currentTerm).subscribe({
        next: (data) => {
          // this.termsList.push(data); // Optimistic update, better to reload
          this.loadTerms();
          alert('Term added successfully!');
          this.closeTermModal();
        },
        error: (error: any) => {
          alert('Error adding term. ' + (error.error?.message || error.message));
          console.error('Error adding term:', error);
        }
      });
    }
  }

  viewTerm(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/terms', id]); // Navigate to term detail page
    } else {
      console.error('Term ID is undefined for view.');
      alert('Cannot view details: Term ID is missing.');
    }
  }
}
