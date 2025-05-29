import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentProfileService } from 'src/app/services/student-profile.service'; // Assuming this service can also update company parts or a new service is used.
import { CompanyService } from 'src/app/services/company.service'; // For company specific updates

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {

  profileForm!: FormGroup;
  // editMode is implicitly true as this is an update component
  profilePicUrl: string | null = null; // To store the full URL for preview after upload or if already present

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfileUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // data can include existing profile info and isCompanyProfile flag
    private studentProfileService: StudentProfileService,
    private companyService: CompanyService, // Inject CompanyService
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      // Common fields
      name: [this.data?.name || '', Validators.required],
      email: [{ value: this.data?.email || '', disabled: true }, [Validators.required, Validators.email]], // Keep email disabled
      phone: [this.data?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      address: [this.data?.address || '', Validators.required],
      profilePic: [this.data?.profilePic || null], // Not required to upload new one, stores URL
      bio: [this.data?.bio || '', Validators.maxLength(this.data?.isCompanyProfile ? 1000 : 500)],

      // Student-specific fields (conditionally added to form if needed, or always present and just hidden by template)
      fieldOfStudy: [this.data?.fieldOfStudy || ''],
      dateOfBirth: [this.data?.dateOfBirth || ''],

      // Company-specific fields
      industry: [this.data?.industry || ''],
      website: [this.data?.website || '']
    });

    // If a profile picture URL is already in the data, use it for the preview
    if (this.data?.profilePic) {
      this.profilePicUrl = this.data.profilePic;
    }

    // Dynamically set validators for student/company specific fields if necessary
    if (!this.data?.isCompanyProfile) { // Student
      this.profileForm.get('fieldOfStudy')?.setValidators([Validators.required]);
      this.profileForm.get('dateOfBirth')?.setValidators([Validators.required]);
    } else { // Company
      this.profileForm.get('fieldOfStudy')?.clearValidators();
      this.profileForm.get('dateOfBirth')?.clearValidators();
      // Add company specific validators if any, e.g. for industry
      // this.profileForm.get('industry')?.setValidators([Validators.required]);
    }
    this.profileForm.updateValueAndValidity();


    // No need for setFormData as patchValue is done during init.
    // this.profileId is not used as data itself should contain the user ID for update.
  }

  submit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched(); // Ensure validation errors are shown
      alert('Please fill out all required fields correctly.');
      return;
    }

    // Get raw value including disabled fields like email if needed by backend, otherwise use .value
    const profileData = this.profileForm.getRawValue();

    // If profilePicUrl has a new value from upload (e.g. starts with http/data:), use it.
    // Otherwise, the existing profilePic value (which might be a relative path) is already in profileData.
    if (this.profilePicUrl && (this.profilePicUrl.startsWith('http') || this.profilePicUrl.startsWith('data:'))) {
      profileData.profilePic = this.profilePicUrl;
    }


    if (this.data?.isCompanyProfile) {
      // Call company update service
      // Assuming data.id holds the company ID
      this.companyService.updateCompanyProfile(this.data.id, profileData).subscribe({
        next: (updatedProfile) => {
          this.dialogRef.close({ action: 'update', profile: updatedProfile });
        },
        error: (error) => {
          console.error('Error updating company profile:', error);
          alert('Failed to update company profile. ' + (error.error?.message || error.message));
        }
      });
    } else {
      // Call student update service
      this.studentProfileService.updateProfile(profileData).subscribe({
        next: (updatedProfile) => {
          this.dialogRef.close({ action: 'update', profile: updatedProfile });
        },
        error: (error) => {
          console.error('Error updating student profile:', error);
           alert('Failed to update student profile. ' + (error.error?.message || error.message));
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      // The backend might expect 'file' or a specific DTO field name.
      // For Student, it was 'file'. Assuming similar for Company or a generic endpoint.
      formData.append('file', file);

      // Determine upload URL based on profile type
      const uploadUrl = this.data?.isCompanyProfile ?
        `http://localhost:8222/api/Company/profile-picture` : // Replace with actual Company URL
        `http://localhost:8222/api/Student/profile-picture`;


      this.http.post<{ fileUrl: string }>(uploadUrl, formData)
        .subscribe({
          next: response => {
            this.profilePicUrl = response.fileUrl; // This URL should be absolute or a data URL for immediate preview
            this.profileForm.patchValue({ profilePic: response.fileUrl }); // Update form with the new URL
            this.profileForm.get('profilePic')?.markAsDirty(); // Ensure change is registered
          },
          error: error => {
            console.error('File upload failed:', error);
            alert('File upload failed. Please try another image.');
          }
        });
    }
  }
}
