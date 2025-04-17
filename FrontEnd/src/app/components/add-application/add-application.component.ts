import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-add-application-dialog',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.css']
})
export class AddApplicationDialogComponent implements OnInit {
  applicationForm!: FormGroup;
  editMode = false;
  applicationId?: number;
  internshipId!: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      status: [this.data?.editMode ? '' : 'PENDING', Validators.required],
      coverLetter: ['', Validators.required],
    });

    if (this.data?.editMode && this.data?.id) {
      this.editMode = true;
      this.applicationId = this.data.id;
      this.setFormData(this.data);
    } else if (this.data?.internshipId) {
      this.internshipId = this.data.internshipId;
    }
  }

  setFormData(data: any): void {
    this.applicationForm.patchValue({
      status: data.status,
      coverLetter: data.coverLetter,
    });
    this.internshipId = this.data.internshipId;
  }

  submit(): void {
    if (this.applicationForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const applicationData = this.applicationForm.value;

    if (this.editMode && this.applicationId !== undefined) {
      this.applicationService.updateApplication(this.applicationId, applicationData).subscribe({
        next: (updated) => {
          this.dialogRef.close({ action: 'update', application: updated });
        },
        error: (err) => console.error('Error updating application:', err)
      });
    } else {
      
      this.applicationService.addApplication(applicationData,this.internshipId).subscribe({
        next: (created) => {
          this.dialogRef.close({ action: 'create', application: created });
          this.router.navigate(['/applications']); 
        },
        error: (err) => console.error('Error creating application:', err)
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
