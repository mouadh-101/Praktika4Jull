import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Interview, InterviewService } from 'src/app/service/interview.service';


@Component({
  selector: 'app-interview-add',
  templateUrl: './interview-add.component.html',
  styleUrls: ['./interview-add.component.css']
})
export class InterviewAddComponent {
  cancel(): void {
    this.router.navigate(['/interviews']);
  }

  newInterview: Interview = {
    dateInterview: '',
    location: '',
    notes: '',
    status: 'SCHEDULED'
  };

  constructor(private interviewService: InterviewService, private router: Router) {}

  addInterview(): void {
    this.interviewService.addInterview(this.newInterview).subscribe(() => {
      alert('Interview ajoutée avec succès ! ✅');
      this.router.navigate(['/interviews']); // Redirection vers la liste
    });
  }
}
