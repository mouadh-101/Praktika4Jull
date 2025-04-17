import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Journal } from 'src/app/Models/Journal';
import { Document } from 'src/app/Models/document'
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
    dateJournal: new Date(),
    document: {} as Document,
  };

  constructor(
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.journalService.getJournalById(id).subscribe((data) => {
      this.journal = data;
    });
  }

  onSubmit(): void {
    this.journalService.updateJournal(this.journal, this.journal.idJournal).subscribe(() => {
      this.router.navigate(['/ListDocument']);
    });
  }
  
}