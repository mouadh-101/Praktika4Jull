import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Added Router
import { Journal } from 'src/app/Models/Journal';
import { JournalService } from 'src/app/services/Document/Journal.service';

@Component({
  selector: 'app-Journalback',
  templateUrl: './Journalback.component.html',
  styleUrls: ['./Journalback.component.css']
})
export class JournalbackComponent implements OnInit {

  journals: Journal[] = [];
  stageId!: number; // This is the document ID
  isLoading: boolean = true; // For loading state

  constructor(
    private route: ActivatedRoute,
    private journalService: JournalService,
    private router: Router // Injected Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.stageId = +idParam;
      if (isNaN(this.stageId) || this.stageId <= 0) {
        console.error('Invalid Document ID provided for Journal Back view.');
        alert('Cannot load journal entries: Invalid document reference.');
        this.router.navigate(['/DocumentBack']); // Navigate to a safe fallback
        return;
      }
      this.getJournalsByStage(this.stageId);
    } else {
      console.error('No Document ID found in route for Journal Back view.');
      alert('Cannot load journal entries: Missing document reference.');
      this.router.navigate(['/DocumentBack']); // Navigate to a safe fallback
    }
  }

  getJournalsByStage(id: number): void {
    this.isLoading = true;
    this.journalService.getJournalsByStageId(id).subscribe({
      next: (data) => {
        this.journals = data.map(journal => ({
          ...journal,
          // Ensure dateJournal is a Date object if needed by pipes or other logic
          dateJournal: journal.dateJournal ? new Date(journal.dateJournal) : new Date()
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching journal entries:', err);
        alert('Failed to load journal entries. ' + (err.error?.message || err.message));
        this.isLoading = false;
        // Optionally navigate back or show error in template
      }
    });
  }

  deleteJournal(id: number): void {
    if (!id) {
      alert('Cannot delete: Journal ID is missing.');
      return;
    }
    if (confirm('Are you sure you want to delete this journal entry?')) {
      this.journalService.deleteJournal(id).subscribe({
        next: () => {
          this.journals = this.journals.filter(j => j.idJournal !== id);
          alert('Journal entry deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting journal entry:', err);
          alert('Error deleting journal entry. ' + (err.error?.message || err.message));
        }
      });
    }
  }
}