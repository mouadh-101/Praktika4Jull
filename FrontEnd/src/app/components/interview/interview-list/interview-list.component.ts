import { Component, OnInit } from '@angular/core';
import { Interview, InterviewService } from 'src/app/services/interview.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
})
export class InterviewListComponent implements OnInit {
  interviews: Interview[] = [];
  searchTerm: string = '';
  p: number = 1; // Page actuelle pour la pagination

  constructor(private interviewService: InterviewService, private router: Router) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewService.getAllInterviews().subscribe(data => {
      this.interviews = data;
    });
  }

  deleteInterview(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette interview ?')) {
      this.interviewService.deleteInterview(id).subscribe(() => {
        this.loadInterviews(); // Recharger la liste après suppression
      });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/interviews/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/interviews/edit', id]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'status-scheduled';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELED': return 'status-canceled';
      default: return '';
    }
  }
}
