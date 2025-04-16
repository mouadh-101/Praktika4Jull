import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

  application!: any;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getApplicationDetails(+id);
    }
  }

  getApplicationDetails(id: number): void {
    this.applicationService.getApplicationById(id).subscribe({
      next: (data:any) => {
        this.application = data;
        this.loading = false;
        console.log(this.application);
      },
      error: (err:any) => {
        this.error = 'Failed to load application details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  withdrawApplication(id: number): void {
    
  }
}
