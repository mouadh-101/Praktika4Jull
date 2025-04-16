import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Journal } from 'src/app/Models/Journal';
import { JournalService } from 'src/app/services/Document/Journal.service';

@Component({
  selector: 'app-AddJournal',
  templateUrl: './AddJournal.component.html',
  styleUrls: ['./AddJournal.component.css']
})
export class AddJournalComponent implements OnInit {

  journal: Journal = {
    idJournal: 0,
    tache: '',
    dateJournal: new Date(),
    document: null! // ou { ... } si tu veux l'initialiser
  };

  idStage!: number;

  constructor(
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idStage = +this.route.snapshot.paramMap.get('id')!;
  }

  onSubmit(): void {
    this.journalService.addJournal(this.journal, this.idStage).subscribe(() => {
      this.router.navigate(['/ListJournal', this.idStage]);
    });
  }
}
