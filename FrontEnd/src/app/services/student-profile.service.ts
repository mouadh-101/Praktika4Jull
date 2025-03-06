// src/app/services/cv.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';
import { saveAs } from 'file-saver'

@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {
  private apiUrl='http://localhost:8222/api/Student'


  constructor(private http: HttpClient) {}

  updateProfile(user: any): Observable<any> {
    const forUser = this.http.put('http://localhost:8222/api/users', user);
    const forStudent = this.http.put(`${this.apiUrl}/update`, user);
  
    return forkJoin([forUser, forStudent]).pipe(
      catchError(this.handleError)
    );
  }

  getStudentData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * Add a new skill for the logged-in student.
   */
  addSkill(skill: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Skills`, skill).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing skill for the logged-in student.
   */
  updateSkill(skillId: number, updatedSkill: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Skills/${skillId}`, updatedSkill).pipe(
      catchError(this.handleError)
    );
  }
  /**
   * affect an existing skill for the logged-in student.
   */
  disAffectSkill(skillId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Skills/disAffect/${skillId}`,null).pipe(
      catchError(this.handleError)
    );
  }
  /**
   * disffect an existing skill for the logged-in student.
   */
  affectSkill(skillId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Skills/affect/${skillId}`,null).pipe(
      catchError(this.handleError)
    );
  }
  /**
   * get 10 existing skill.
   */
  get10Skill(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Skills/f10`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a skill for the logged-in student.
   */
  deleteSkill(skillId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Skills/${skillId}`).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * Add a new education entry for the logged-in student.
   */
  addEducation(education: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Edu`, education).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing education entry for the logged-in student.
   */
  updateEducation(educationId: number, updatedEducation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Edu/${educationId}`, updatedEducation).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete an education entry for the logged-in student.
   */
  deleteEducation(educationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Edu/${educationId}`).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * Add a new extra-curricular activity for the logged-in student.
   */
  addExtraActivity(activity: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ExtraAct`, activity).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing extra-curricular activity for the logged-in student.
   */
  updateExtraActivity(activityId: number, updatedActivity: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ExtraAct/${activityId}`, updatedActivity).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete an extra-curricular activity for the logged-in student.
   */
  deleteExtraActivity(activityId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ExtraAct/${activityId}`).pipe(
      catchError(this.handleError)
    );
  }
  addWorkExperience(WorkExperience: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/WorkExp`, WorkExperience).pipe(
      catchError(this.handleError)
    );
  }

  deleteWorkExperience(workId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/WorkExp/${workId}`).pipe(
      catchError(this.handleError)
    );
  }
  updateWorkExperience(WorkExperienceId: number, updatedWorkExperience: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ExtraAct/${WorkExperienceId}`, updatedWorkExperience).pipe(
      catchError(this.handleError)
    );
  }
  skillEnhancer():Observable<any>{
    return this.http.get(`${this.apiUrl}/Skills/enhancer`).pipe(
      catchError(this.handleError)
    );
  }
  exportPdf(user: any,templat:string): void {
    this.http.post(`${this.apiUrl}/export-pdf/${templat}`, user, { responseType: 'blob' })
      .subscribe({
        next: (response: Blob) => {
          // Save the PDF file
          saveAs(response, 'resume.pdf');
        },
        error: (error) => {
          console.error('Error exporting PDF:', error);
        }
      });
  }



  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Redirect to Sign In page if not authenticated
      window.location.href = '/sign-in';
    }
    return throwError(() => new Error('An error occurred while fetching users'));
  }
}




