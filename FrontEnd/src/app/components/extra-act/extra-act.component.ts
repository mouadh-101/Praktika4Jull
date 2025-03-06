import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentProfileService } from 'src/app/services/student-profile.service';

@Component({
  selector: 'app-extra-act',
  templateUrl: './extra-act.component.html',
  styleUrls: ['./extra-act.component.css']
})
export class ExtraActComponent implements OnInit{
  extraActivityForm!: FormGroup;
  editMode = false;
  extraActivityId?: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExtraActComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentProfileService: StudentProfileService
  ) {}

  ngOnInit(): void {
    this.extraActivityForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (this.data && this.data.id) {
      this.editMode = true;
      this.extraActivityId = this.data.id;
      this.setFormData(this.data);
    }
  }

  setFormData(data: any): void {
    this.extraActivityForm.patchValue({
      title: data.title,
      description: data.description
    });
  }

  submit(): void {
    if (this.extraActivityForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const activityData = { ...this.extraActivityForm.value };

    if (this.editMode && this.extraActivityId !== undefined) {
      this.studentProfileService.updateExtraActivity(this.extraActivityId, activityData).subscribe(
        (updatedActivity) => {
          this.dialogRef.close({ action: 'update', activity: updatedActivity });
        },
        (error) => {
          console.error('Error updating Extra Activity:', error);
        }
      );
    } else {
      this.studentProfileService.addExtraActivity(activityData).subscribe(
        (newActivity) => {
          this.dialogRef.close({ action: 'add', activity: newActivity });
        },
        (error) => {
          console.error('Error adding Extra Activity:', error);
        }
      );
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}


