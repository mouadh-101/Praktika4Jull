import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentProfileService } from 'src/app/services/student-profile.service';

@Component({
  selector: 'app-work-exp',
  templateUrl: './work-exp.component.html',
  styleUrls: ['./work-exp.component.css']
})
export class WorkExpComponent implements OnInit {
  workExperienceForm!: FormGroup;
  editMode = false;
  workExperienceId?: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<WorkExpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentProfileService: StudentProfileService
  ) {}

  ngOnInit(): void {
    this.workExperienceForm = this.fb.group({
      address: ['', Validators.required],
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      description: ['']
    });

    if (this.data && this.data.id) {
      this.editMode = true;
      this.workExperienceId = this.data.id;
      this.setFormData(this.data);
    }
  }

  setFormData(data: any): void {
    this.workExperienceForm.patchValue({
      address: data.address,
      position: data.position,
      companyName:data.companyName,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description
    });
  }

  submit(): void {
    if (this.workExperienceForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const workExperienceData = { ...this.workExperienceForm.value };

    if (this.editMode && this.workExperienceId !== undefined) {
      this.studentProfileService.updateWorkExperience(this.workExperienceId, workExperienceData).subscribe(
        (updatedExperience) => {
          this.dialogRef.close({ action: 'update', experience: updatedExperience });
        },
        (error) => {
          console.error('Error updating Work Experience:', error);
        }
      );
    } else {
      this.studentProfileService.addWorkExperience(workExperienceData).subscribe(
        (newExperience) => {
          this.dialogRef.close({ action: 'add', experience: newExperience });
        },
        (error) => {
          console.error('Error adding Work Experience:', error);
        }
      );
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
