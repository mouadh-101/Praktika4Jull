import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Journal } from 'src/app/Models/Journal';
import { JournalService } from 'src/app/services/Document/Journal.service';

@Component({
  selector: 'app-Journalback',
  templateUrl: './Journalback.component.html',
  styleUrls: ['./Journalback.component.css']
})
export class JournalbackComponent implements OnInit {

  journals: Journal[] = [];
   stageId!: number;
 
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
       this.journals = this.journals.filter(j => j.idJournal !== id);
     });
   }
 }