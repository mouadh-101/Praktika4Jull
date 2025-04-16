import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Journal } from 'src/app/Models/Journal';
import { JournalService } from 'src/app/services/Document/Journal.service';

@Component({
  selector: 'app-ListJournal',
  templateUrl: './ListJournal.component.html',
  styleUrls: ['./ListJournal.component.css']
})
export class ListJournalComponent implements OnInit {

  journals: Journal[] = [];
  stageId!: number;
  pagedJournals: Journal[] = [];
  page: number = 1; // Page actuelle pour la pagination
  itemsPerPage: number = 6;

  constructor(
    private route: ActivatedRoute,
    private journalService: JournalService
  ) {}

  ngOnInit(): void {
    this.stageId = +this.route.snapshot.paramMap.get('id')!;
    this.getJournalsByStage(this.stageId);
  }

  getJournalsByStage(id: number): void {
    this.journalService.getJournalsByStageId(id).subscribe((data) => {
      this.journals = data;
    });
  }


  deleteJournal(id: number): void {
    this.journalService.deleteJournal(id).subscribe(() => {
      this.journals = this.journals.filter(j => j.idJournal !== id);  // Supprimer le journal de la liste
    });
  }
}