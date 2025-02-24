// src/app/components/skill-form/skill-form.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentProfileService } from 'src/app/services/student-profile.service';
@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {
  skillForm!: FormGroup;
  editMode = false; // Track if the form is in edit mode
  skillId?: number; // Store the skill ID if editing

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SkillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Inject the passed data
    private studentProfileService:StudentProfileService
  ) {}

  ngOnInit(): void {
    this.skillForm = this.fb.group({
      name: ['', Validators.required],
    });

    // Check if data is provided (for editing)
    if (this.data && this.data.id) {
      this.editMode = true;
      this.skillId = this.data.id;
      this.setFormData(this.data);
    }
  }

  setFormData(data: any): void {
    this.skillForm.patchValue({
      name: data.name,
    });
  }

  submit(): void {
    if (this.skillForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }
    const skillData = {
      ...this.skillForm.value,
      students:[]
    };


    if (this.editMode && this.skillId !== undefined) {
      // Update existing skill
      this.studentProfileService.updateSkill(this.skillId, skillData).subscribe(
        (updatedSkill) => {
          this.dialogRef.close({ action: 'update', skill: updatedSkill });
        },
        (error) => {
          console.error('Error updating skill:', error);
        }
      );
    } else {
      // Add new skill
      this.studentProfileService.addSkill(skillData).subscribe(
        (newSkill) => {
          this.dialogRef.close({ action: 'add', skill: newSkill });
        },
        (error) => {
          console.error('Error adding skill:', error);
        }
      );
    }
  }

  cancel(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }
}