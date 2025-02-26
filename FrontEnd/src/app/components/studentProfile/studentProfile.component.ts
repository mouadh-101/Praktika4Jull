import { Component, OnInit } from '@angular/core';
import { StudentProfileService } from '../../services/student-profile.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SkillComponent } from '../skill/skill.component';
import { EducationComponent } from '../education/education.component';

@Component({
  selector: 'app-studentProfile',
  templateUrl: './studentProfile.component.html',
  styleUrls: ['./studentProfile.component.css']
})
export class StudentProfileComponent implements OnInit {
  userData: any = {};
  studentData:any={};
  constructor(private studentProfileService: StudentProfileService, private userService: UserService,public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUserDataAndInitializeCV();
  }

  fetchUserDataAndInitializeCV(): void {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    this.userService.getUserData().subscribe({
      next: (userData) => {
        this.userData = userData;
        console.log('User data fetched:', userData);
  
        this.studentProfileService.getStudentData().subscribe({
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
  
  onUpdateSkill(skillId: number): void {
    const dialogRef = this.dialog.open(SkillComponent, {
      width: '400px',
      data: this.studentData.skills?.find((skill: any) => skill.id === skillId)
    });

    dialogRef.componentInstance.setFormData(dialogRef.componentInstance.data); // Pass data to form
  }

  onDeleteSkill(skillId: number): void {
    this.studentProfileService.deleteSkill(skillId).subscribe(
      () => {
        this.studentData.skills = this.studentData.skills?.filter((skill: any) => skill.id !== skillId);
      },
      (error) => {
        console.error('Error deleting skill:', error);
      }
    );
  }

  onAddSkill(): void {
    const dialogRef = this.dialog.open(SkillComponent, {
      width: '400px'
    });
    
  }

  onUpdateEducation(educationId: number): void {
    const dialogRef = this.dialog.open(EducationComponent, {
      width: '500px',
      data: this.studentData.educations?.find((edu: any) => edu.id === educationId)
    });

    dialogRef.componentInstance.setFormData(dialogRef.componentInstance.data); // Pass data to form
  }

  onDeleteEducation(educationId: number): void {
    this.studentProfileService.deleteEducation(educationId).subscribe(
      () => {
        this.studentData.educations = this.studentData.educations?.filter((edu: any) => edu.id !== educationId);
      },
      (error) => {
        console.error('Error deleting education:', error);
      }
    );
  }

  onAddEducation(): void {
    const dialogRef = this.dialog.open(EducationComponent, {
      
    });
  }
  onUpdateProfile(): void {
    console.log('Updating profile...');
    // Navigate to update profile form or open modal
  }

  onUpdateBio(id: number): void {
    console.log('Updating bio for student ID:', id);
    // Open bio update modal or navigate to update page
  }

  onUpdateFieldOfStudy(id: number): void {
    console.log('Updating field of study for student ID:', id);
    // Open field of study update modal or navigate to update page
  }

  onUpdateDateOfBirth(id: number): void {
    console.log('Updating date of birth for student ID:', id);
    // Open date of birth update modal or navigate to update page
  }



  onUpdateActivity(activityId: number): void {
    console.log('Updating activity with ID:', activityId);
    // Open activity update modal or navigate to update page
  }

  onDeleteActivity(activityId: number): void {
    console.log('Deleting activity with ID:', activityId);
    this.studentProfileService.deleteExtraActivity(activityId).subscribe(
      () => {
        this.studentData.extraActivities = this.studentData.extraActivities?.filter((activity:any) => activity.id !== activityId); // Remove activity after deletion
      },
      (error) => {
        console.error('Error deleting activity:', error);
      }
    );
  }

  onAddActivity(): void {
    console.log('Adding new activity...');
    // Open activity add modal or navigate to add page
  }

  onUpdateWorkExperience(workId: number): void {
    console.log('Updating work experience with ID:', workId);
    // Open work experience update modal or navigate to update page
  }

  onDeleteWorkExperience(workId: number): void {
    console.log('Deleting work experience with ID:', workId);
    this.studentProfileService.deleteWorkExperience(workId).subscribe(
      () => {
        this.studentData.workExperiences = this.studentData.workExperiences?.filter((work:any)=> work.id !== workId); // Remove work experience after deletion
      },
      (error) => {
        console.error('Error deleting work experience:', error);
      }
    );
  }

  onAddWorkExperience(): void {
    console.log('Adding new work experience...');
    // Open work experience add modal or navigate to add page
  }


}




 
