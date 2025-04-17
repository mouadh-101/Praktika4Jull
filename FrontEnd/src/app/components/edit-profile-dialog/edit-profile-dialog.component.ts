import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css']
})
export class EditProfileDialogComponent implements OnInit{
  profileForm!: FormGroup;
  profileId?: number;
  editMode = false;
  profilePicUrl: string | null = null;
  constructor(

    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
     private companyservcie: CompanyService,
        private http: HttpClient
  ) {
   
  }
  ngOnInit(): void {
    this.profileForm = this.fb.group({
      logo: ['', Validators.required],
      website: ['', Validators.required],
      industry: ['', Validators.required],
      description: ['', Validators.required],
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
      logo: data.logo,
      website: data.website,
      description: data.description,
      industry: data.industry,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address
    });
  }
  onSave(): void {
    if (this.profileForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
    const profileData = { ...this.profileForm.value };

    if (this.editMode && this.profileId !== undefined) {
      this.companyservcie.updateProfile(profileData).subscribe(
        (updatedProfile) => {
          this.dialogRef.close({ action: 'update', profile: updatedProfile });
        },
        (error) => {
          console.error('Error updating profile:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // clé = "file" comme dans @RequestParam("file")
  
      this.http.post<{ fileUrl: string }>(
        'http://localhost:8222/api/internships/company/profile-picture',
        formData
      ).subscribe(
        response => {
          this.profilePicUrl = `http://localhost:8222${response.fileUrl}`; // pour l'afficher directement
          this.profileForm.patchValue({ logo: this.profilePicUrl });
        },
        error => {
          console.error('File upload failed:', error);
        }
      );
    }
  }
  
  
}
