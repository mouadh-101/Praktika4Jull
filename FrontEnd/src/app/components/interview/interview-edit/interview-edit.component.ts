import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Interview, InterviewService } from 'src/app/service/interview.service';

@Component({
  selector: 'app-interview-edit',
  templateUrl: './interview-edit.component.html',
  styleUrls: ['./interview-edit.component.css']
})
export class InterviewEditComponent implements OnInit {
  interview: Interview = {
    dateInterview: '',
    location: '',
    notes: '',
    status: 'SCHEDULED'
  };

  constructor(
    private interviewService: InterviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.interviewService.getInterviewById(+id).subscribe(data => {
        this.interview = data;
      });
    }
  }

  updateInterview(): void {
    this.interviewService.updateInterview(this.interview).subscribe(() => {
      this.router.navigate(['/interviews']); // Retour à la liste après modification
    });
  }

  cancel(): void {
    this.router.navigate(['/interviews']); // Annuler et revenir à la liste
  }
}
