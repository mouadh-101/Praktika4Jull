import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Journal } from 'src/app/Models/Journal'; // Assuming Journal model has idJournal, tache, dateJournal, document
import { Document } from 'src/app/Models/document'; // To type the document property in Journal
import { JournalService } from 'src/app/services/Document/Journal.service';

@Component({
  selector: 'app-AddJournal',
  templateUrl: './AddJournal.component.html',
  styleUrls: ['./AddJournal.component.css']
})
export class AddJournalComponent implements OnInit {

  journal: Journal = {
    idJournal: 0, // Typically backend generates ID, so 0 or undefined for new entry
    tache: '',
    dateJournal: new Date(), // Initialize with current date
    // document property needs to be correctly typed and initialized if used directly
    // If only document ID is needed, it's handled by idStage
    document: { docid: 0 } as Document // Minimal initialization if document object is expected by service
  };

  idStage!: number; // This is the document ID the journal is associated with

  constructor(
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idStage = +idParam;
      if (isNaN(this.idStage) || this.idStage <= 0) {
        console.error('Invalid Document ID (idStage) provided for new journal entry.');
        alert('Cannot add journal entry: Invalid document context.');
        this.router.navigate(['/ListDocument']); // Redirect if ID is invalid
      } else {
         // Initialize dateJournal to today's date in yyyy-MM-dd format for the date input
        this.journal.dateJournal = new Date().toISOString().split('T')[0] as any;
      }
    } else {
      console.error('No Document ID (idStage) found in route for new journal entry.');
      alert('Cannot add journal entry: Missing document context.');
      this.router.navigate(['/ListDocument']); // Redirect if no ID
    }
  }

  onSubmit(): void {
    // The form validity is checked by the [disabled] binding on the button
    // No need for an additional check here if using #journalFormInstance.form.valid in template

    // Ensure the document ID (idStage) is associated with the journal entry
    // The service method addJournal(this.journal, this.idStage) handles this association.
    // If the journal object itself needs to carry the document ID:
    // this.journal.document = { docid: this.idStage } as Document; // Or however your model is structured

    this.journalService.addJournal(this.journal, this.idStage).subscribe({
      next: (response) => {
        console.log('Journal entry added successfully', response);
        alert('Journal entry added successfully!');
        this.router.navigate(['/ListJournal', this.idStage]);
      },
      error: (error) => {
        console.error('Error adding journal entry', error);
        alert('Error adding journal entry. ' + (error.error?.message || error.message));
      }
    });
  }

  goBackToListJournals(): void {
    if (this.idStage) {
      this.router.navigate(['/ListJournal', this.idStage]);
    } else {
      // Fallback if idStage isn't available for some reason
      this.router.navigate(['/ListDocument']);
    }
  }
}
