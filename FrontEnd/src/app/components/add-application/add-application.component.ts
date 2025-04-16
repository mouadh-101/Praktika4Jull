import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.css']
})
export class AddApplicationDialogComponent {
  applicationForm!: FormGroup;
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private dialogRef: MatDialogRef<AddApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { internshipId: number } // Pass internshipId via dialog data
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      coverLetter: ['', Validators.required] 
    });
  }

  submit(): void {
    if (this.applicationForm.valid) {
      const applicationData = this.applicationForm.value;

      // Pass the internshipId along with the application data
      this.applicationService.addApplication(applicationData, this.data.internshipId).subscribe({
        next: (response) => {
          this.dialogRef.close(true); // Success
        },
        error: (error) => {
          console.error('Error submitting application:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  cancel(): void {
    this.dialogRef.close(false); 
  }
}