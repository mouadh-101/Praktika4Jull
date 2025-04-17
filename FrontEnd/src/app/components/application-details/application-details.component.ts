import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { MatDialog } from '@angular/material/dialog';
import { AddApplicationDialogComponent } from '../add-application/add-application.component';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

  application!: any;
  loading: boolean = true;
  error: string = '';
  showMore: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private dialog: MatDialog,
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

  onUpdateApplication(appId: number): void {
    const dialogRef = this.dialog.open(AddApplicationDialogComponent, {
      width: '600px',
      data: {
        ...this.application,
        id: appId,
        editMode: true,             
      }
    });
  
    dialogRef.componentInstance.setFormData(dialogRef.componentInstance.data);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'update') {
        this.applicationService.getApplicationById(appId).subscribe({
          next: (updatedApp) => this.application = updatedApp,
          error: (err) => console.error('Failed to reload application:', err)
        });
      }
    });
  }
  onAnalyze(id:number):void
  {
    this.router.navigate(['applicationsAnalyser', id]);
  }
  onDeleteApplication(appId: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.deleteApplication(appId).subscribe({
        next: () => {
          alert('Application deleted successfully.');
          this.router.navigate(['/applications']); 
        },
        error: (err) => {
          console.error('Failed to delete application:', err);
          alert('Failed to delete application.');
        }
      });
    }
  }
}
