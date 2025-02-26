// src/app/components/education-form/education-form.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentProfileService } from 'src/app/services/student-profile.service';
@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {
  educationForm!: FormGroup;
  editMode = false;
  educationId?: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EducationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentProfileService:StudentProfileService
  ) {}

  ngOnInit(): void {
    this.educationForm = this.fb.group({
      degree: ['', Validators.required],
      schoolName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    if (this.data && this.data.id) {
      this.editMode = true;
      this.educationId = this.data.id;
      this.setFormData(this.data);
    }
  }

  setFormData(data: any): void {
    this.educationForm.patchValue({
      degree: data.degree,
      schoolName: data.schoolName,
      startDate: data.startDate,
      endDate: data.endDate
    });
  }

  submit(): void {
    if (this.educationForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }
    const educationData = {
      ...this.educationForm.value
    };

    if (this.editMode && this.educationId !== undefined) {
      this.studentProfileService.updateEducation(this.educationId, educationData).subscribe(
        (updatedEducation) => {
          this.dialogRef.close({ action: 'update', education: updatedEducation });
        },
        (error) => {
          console.error('Error updating Education:', error);
        }
      );
    } else {
      this.studentProfileService.addEducation(educationData).subscribe(
        (newEdu) => {
          this.dialogRef.close({ action: 'add', educaion: newEdu });
        },
        (error) => {
          console.error('Error adding skill:', error);
        }
      );
    }
  }
  

  cancel(): void {
    this.dialogRef.close();
  }
}