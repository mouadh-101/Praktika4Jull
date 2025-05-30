import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService, Interview, InterviewStatus } from 'src/app/services/interview.service'; // Assuming InterviewStatus enum
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-interview-edit',
  templateUrl: './interview-edit.component.html',
  styleUrls: ['./interview-edit.component.css']
})
export class InterviewEditComponent implements OnInit {
  interviewForm!: FormGroup;
  minDate: string = ''; // For date picker min attribute
  interviewId!: number;
  
  isLoading: boolean = true;
  errorMessage: string | null = null;
  
  // public InterviewStatus = InterviewStatus; // Expose enum if needed for select options in template

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date();
    // For editing, minDate might still be relevant if they change the date to ensure it's not in the past.
    // However, if they are just editing notes for a past interview, this minDate on datepicker might be irrelevant.
    // For now, we keep it, assuming date changes must be to the future.
    today.setDate(today.getDate() + 1); 
    this.minDate = today.toISOString().split('T')[0];

    this.interviewForm = this.fb.group({
      dateInterview: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      notes: ['', [Validators.required, Validators.minLength(5)]],
      status: ['SCHEDULED', Validators.required] // Default status
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.interviewId = +idParam;
      if (isNaN(this.interviewId) || this.interviewId <= 0) {
        console.error('Invalid Interview ID provided.');
        this.errorMessage = 'Invalid interview ID. Cannot load details.';
        this.isLoading = false;
        // Optionally navigate away or disable form
        return;
      }
      this.loadInterviewDetails(this.interviewId);
    } else {
      console.error('No Interview ID found in route.');
      this.errorMessage = 'No interview ID found. Cannot load details.';
      this.isLoading = false;
      // Optionally navigate away
    }
  }

  loadInterviewDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.interviewService.getInterviewById(id).subscribe({
      next: data => {
        if (data.dateInterview) {
          // Ensure date is formatted as yyyy-MM-dd for the input control
          data.dateInterview = this.formatDateForInput(data.dateInterview);
        }
        this.interviewForm.patchValue(data);
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching interview details:', err);
        this.errorMessage = 'Failed to load interview details. ' + (err.error?.message || err.message);
        this.isLoading = false;
      }
    });
  }
  
  private formatDateForInput(date: string | Date): string {
    if (!date) return '';
    // Ensure it's a Date object before calling toISOString
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0,0,0,0); // Also zero out time for selected date

    return selectedDate > today ? null : { invalidDate: true };
  }

  submitForm(): void { // Renamed from updateInterview
    if (this.interviewForm.invalid) {
      this.interviewForm.markAllAsTouched();
      alert('Please fill out all required fields correctly.');
      return;
    }

    const updatedInterviewData: Interview = {
      interviewId: this.interviewId,
      ...this.interviewForm.value
    };

    this.isLoading = true; // Show loading for submit action
    this.errorMessage = null;

    this.interviewService.updateInterview(updatedInterviewData).subscribe({
      next: () => {
        alert('Interview updated successfully!');
        this.isLoading = false;
        this.router.navigate(['/interviews']); // Or back to details page: ['/interviews/details', this.interviewId]
      },
      error: (err) => {
        console.error('Error updating interview:', err);
        this.errorMessage = 'Failed to update interview. ' + (err.error?.message || err.message);
        this.isLoading = false;
        alert(this.errorMessage); // Also show alert for submission errors
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/interviews']); // Navigate back to the interview list
  }
}
