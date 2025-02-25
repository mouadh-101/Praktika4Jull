import { Component, OnInit } from '@angular/core';
<<<<<<< Updated upstream
import { Interview, InterviewService } from 'src/app/service/interview.service';
=======
import { Interview, InterviewService } from 'src/app/services/interview.service';
>>>>>>> Stashed changes
import { Router } from '@angular/router';


@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {
  router: any;
  navigateToEdit(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/edit-interview', id]); // Redirige vers la page d'édition
    } else {
      console.error("L'ID de l'interview est indéfini !");
    }
  }

  interviews: Interview[] = [];
  filteredInterviews: Interview[] = [];
  searchText: string = '';

  newInterview: Interview = { dateInterview: '', location: '', notes: '', status: 'SCHEDULED' };
  selectedInterview: Interview | null = null;

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewService.getAllInterviews().subscribe(data => {
      this.interviews = data;
      this.filteredInterviews = data;
    });
  }

  addInterview(): void {
    this.interviewService.addInterview(this.newInterview).subscribe(() => {
      this.loadInterviews();
      this.newInterview = { dateInterview: '', location: '', notes: '', status: 'SCHEDULED' };
    });
  }

  deleteInterview(id?: number): void {
    if (id !== undefined) {
      this.interviewService.deleteInterview(id).subscribe(() => {
        this.loadInterviews();
      });
    }
  }

  editInterview(interview: Interview): void {
    this.selectedInterview = { ...interview };
  }

  updateInterview(): void {
    if (this.selectedInterview) {
      this.interviewService.updateInterview(this.selectedInterview).subscribe(() => {
        this.loadInterviews();
        this.selectedInterview = null;
      });
    }
  }

  filterInterviews(): void {
    this.filteredInterviews = this.interviews.filter(interview =>
      interview.location.toLowerCase().includes(this.searchText.toLowerCase()) ||
      interview.status.toLowerCase().includes(this.searchText.toLowerCase()) ||
      interview.dateInterview.includes(this.searchText)
    );
  }
}
