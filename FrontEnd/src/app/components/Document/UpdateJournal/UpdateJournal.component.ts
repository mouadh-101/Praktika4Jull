import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Journal } from 'src/app/Models/Journal';
import { Document } from 'src/app/Models/document'; // Ensure Document model is imported
import { JournalService } from 'src/app/services/Document/Journal.service';

@Component({
  selector: 'app-UpdateJournal',
  templateUrl: './UpdateJournal.component.html',
  styleUrls: ['./UpdateJournal.component.css']
})
export class UpdateJournalComponent implements OnInit {
  journal: Journal = {
    idJournal: 0,
    tache: '',
    dateJournal: new Date(), // Will be overwritten by fetched data or formatted for input
    document: {} as Document, // Initialize document, will be populated from fetched journal
  };
  isLoading: boolean = true; // To show a loading state

  constructor(
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      if (isNaN(id) || id <= 0) {
        console.error('Invalid Journal ID provided.');
        alert('Cannot update journal entry: Invalid journal ID.');
        this.router.navigate(['/ListDocument']); // Fallback redirect
        return;
      }
      this.journalService.getJournalById(id).subscribe({
        next: (data) => {
          this.journal = data;
          // Ensure dateJournal is formatted correctly for the input type="date"
          if (this.journal.dateJournal) {
            this.journal.dateJournal = new Date(this.journal.dateJournal); //.toISOString().split('T')[0] as any;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching journal entry:', err);
          alert('Failed to load journal entry details. ' + (err.error?.message || err.message));
          this.isLoading = false;
          this.goBackToListJournals(); // Navigate back if entry can't be loaded
        }
      });
    } else {
      console.error('No Journal ID found in route.');
      alert('Cannot update journal entry: Missing journal ID.');
      this.router.navigate(['/ListDocument']); // Fallback redirect
    }
  }

  onSubmit(): void {
    // Form validity is checked by [disabled] binding on the button in the template
    if (!this.journal.idJournal) {
      alert('Cannot update: Journal ID is missing.');
      return;
    }

    this.journalService.updateJournal(this.journal, this.journal.idJournal).subscribe({
      next: () => {
        alert('Journal entry updated successfully!');
        this.goBackToListJournals();
      },
      error: (error) => {
        console.error('Error updating journal entry:', error);
        alert('Error updating journal entry. ' + (error.error?.message || error.message));
      }
    });
  }

  goBackToListJournals(): void {
    if (this.journal && this.journal.document && this.journal.document.docid) {
      this.router.navigate(['/ListJournal', this.journal.document.docid]);
    } else {
      // Fallback if document ID isn't available for some reason
      console.warn('Document ID not found for this journal, navigating to general document list.');
      this.router.navigate(['/ListDocument']);
    }
  }
}