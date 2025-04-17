import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit{
  userData: any = {};
  studentData:any={};
  

   constructor(private campaonyservcie: CompanyService, private userService: UserService,public dialog: MatDialog, private fb: FormBuilder) {}
   ngOnInit(): void {
    this.fetchUserData(); 
     
  }


  fetchUserData(): void {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
    this.userService.getUserData().subscribe({
      next: (userData) => {
        this.userData = userData;
        console.log('User data fetched:', userData);
        this.campaonyservcie.getCompanyData().subscribe({
          next: (studentData) => {
            this.studentData = studentData;
            console.log('CV data fetched:', studentData);
          },
          error: (error) => console.error('Error fetching CV data:', error)
        });
      },
      error: (error) => console.error('Error fetching user data:', error)
    });
  }
 onUpdateProfile(): void {
 console.log('Updating profile...');
     const dialogRef = this.dialog.open(EditProfileDialogComponent, {
       width: '400px',
       data: { ...this.studentData, ...this.userData }
     });
     dialogRef.componentInstance.setFormData(dialogRef.componentInstance.data); // Pass data to form
 
     dialogRef.afterClosed().subscribe((updatedUser) => {
       if (updatedUser) {
          this.fetchUserData();
       }
     }); 
   
  }
}
