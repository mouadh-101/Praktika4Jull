import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; // Added AbstractControl
import { Router } from '@angular/router';
import { InterviewService, InterviewStatus } from 'src/app/services/interview.service'; // Assuming InterviewStatus might be an enum
import emailjs from '@emailjs/browser'; // Keep if emailjs is used

@Component({
  selector: 'app-interview-add',
  templateUrl: './interview-add.component.html',
  styleUrls: ['./interview-add.component.css']
})
export class InterviewAddComponent implements OnInit {
  interviewForm!: FormGroup;
  minDate: string = '';
  
  // Expose enum to template if needed for select options, though template uses hardcoded strings for now
  // public InterviewStatus = InterviewStatus; 

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum date is tomorrow
    this.minDate = today.toISOString().split('T')[0];

    this.interviewForm = this.fb.group({
      dateInterview: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      notes: ['', [Validators.required, Validators.minLength(5)]],
      status: ['SCHEDULED', Validators.required] // Default status to SCHEDULED
      // Add formControls for candidateId, companyId, or internshipId if needed for submission
    });
  }

  futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) return null; // Don't validate if empty
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    // Adjust for timezone issues if selectedDate is being set to midnight UTC by date picker
    // and today is midnight local time. This ensures 'tomorrow' locally is valid.
    selectedDate.setHours(0,0,0,0); 

    return selectedDate > today ? null : { invalidDate: true };
  }

  addInterview(): void {
    if (this.interviewForm.invalid) {
      this.interviewForm.markAllAsTouched(); // Show validation errors
      alert('Please fill out all required fields correctly.');
      return;
    }

    const interviewData = this.interviewForm.value;
    // Potentially add candidateId/companyId/internshipId to interviewData before sending
    // e.g., interviewData.candidateId = this.someWayToGetCandidateId;

    this.interviewService.addInterview(interviewData).subscribe({
      next: (response) => {
        console.log('Interview scheduled successfully', response);
        alert('Interview scheduled successfully!');
        
        // Send email notification (consider moving to backend for reliability/security)
        // Ensure emailjs parameters are correctly configured and dynamic if needed
        // const emailParams = {
        //   to_email: "candidate.email@example.com", // This needs to be dynamic
        //   subject: "New Interview Scheduled",
        //   message: `Your interview is scheduled for ${interviewData.dateInterview} at ${interviewData.location}. Notes: ${interviewData.notes}`
        // };
        // this.sendEmail(emailParams); // Call a refined sendEmail method

        this.router.navigate(['/interviews']); // Redirect after successful scheduling
      },
      error: (err) => {
        console.error('Error scheduling interview:', err);
        alert('Failed to schedule interview. ' + (err.error?.message || err.message));
      }
    });
  }

  // Example of a more structured email sending method
  // sendEmail(templateParams: any): void {
  //   // Replace with your actual EmailJS service_id, template_id, and user_id
  //   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID')
  //     .then(() => {
  //       console.log('Confirmation email sent successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error sending confirmation email:', error);
  //       // Don't block primary action if email fails, just log it or notify admin
  //     });
  // }

  cancel(): void {
    this.router.navigate(['/interviews']); // Navigate back to the interview list
  }
}
