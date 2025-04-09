import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentProfileService } from 'src/app/services/student-profile.service';
@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {

  profileForm!: FormGroup;
  editMode = false;
  profileId?: number;
  profilePicUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfileUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentProfileService: StudentProfileService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      profilePic: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      bio: ['', Validators.maxLength(500)],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      address: ['', Validators.required]
    });

      this.editMode = true;
      this.profileId = this.data.userId;
      this.setFormData(this.data);
    
  }

  setFormData(data: any): void {
    this.profileForm.patchValue({
      profilePic: data.profilePic,
      fieldOfStudy: data.fieldOfStudy,
      dateOfBirth: data.dateOfBirth,
      bio: data.bio,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address
    });
  }

  submit(): void {
    if (this.profileForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
    const profileData = { ...this.profileForm.value };

    if (this.editMode && this.profileId !== undefined) {
      this.studentProfileService.updateProfile(profileData).subscribe(
        (updatedProfile) => {
          this.dialogRef.close({ action: 'update', profile: updatedProfile });
        },
        (error) => {
          console.error('Error updating profile:', error);
        }
      );
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // Important: key must match @RequestParam("file")
  
      this.http.post<{ fileUrl: string }>('http://localhost:8222/api/Student/profile-picture', formData)
        .subscribe(response => {
          this.profilePicUrl = response.fileUrl;
          this.profileForm.patchValue({ profilePic: response.fileUrl }); // Set URL in form
        }, error => {
          console.error('File upload failed:', error);
        });
    }
  }
}

