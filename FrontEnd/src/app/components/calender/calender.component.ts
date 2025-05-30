import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventClickArg, DateClickArg } from '@fullcalendar/core'; // Import specific types
import { InterviewService, Interview, InterviewStatus } from 'src/app/services/interview.service'; // Assuming InterviewStatus enum
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // For dateClick and eventClick
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  calendarOptions!: CalendarOptions; // Definite assignment
  interviewForm!: FormGroup;
  selectedInterview: Interview | null = null;
  showForm: boolean = false;
  minDate: string = ''; // For date picker min attribute

  // public InterviewStatus = InterviewStatus; // Expose enum if needed for select options

  constructor(
    private interviewService: InterviewService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeCalendarOptions(); // Initialize calendar options first
    this.initializeForm();
    this.setMinDate();
    this.loadInterviews(); // Load events after calendar is ready (or options are set)
  }

  setMinDate(): void {
    const today = new Date();
    // For new interviews, date should be in future. For editing, this might not apply if date is not changed.
    // today.setDate(today.getDate() + 1); // Min date is tomorrow
    this.minDate = today.toISOString().split('T')[0]; // Min date is today
  }
  
  initializeForm(interview?: Interview): void {
    this.interviewForm = this.fb.group({
      dateInterview: [interview?.dateInterview ? this.formatDateForInput(interview.dateInterview) : '', [Validators.required, this.futureDateValidator.bind(this)]],
      location: [interview?.location || '', [Validators.required, Validators.minLength(3)]],
      notes: [interview?.notes || '', [Validators.minLength(5)]], // Notes often optional or minLength if provided
      status: [interview?.status || InterviewStatus.SCHEDULED, Validators.required]
    });
  }
  
  initializeFormForAdd(dateStr?: string): void {
    this.selectedInterview = null;
    this.interviewForm.reset({
      dateInterview: dateStr || '',
      status: InterviewStatus.SCHEDULED // Default status for new interviews
    });
    this.showForm = true;
  }


  futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0,0,0,0);
    // For new events, date must be today or in future. For editing, this might be too restrictive if viewing past event details.
    // For now, let's allow today for scheduling.
    return selectedDate >= today ? null : { invalidDate: true };
  }
  
  private formatDateForInput(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      plugins: [dayGridPlugin, interactionPlugin],
      events: [], // Will be loaded by loadInterviews()
      height: 'auto', // Adjusts height to content, or use a fixed value like '650px'
      aspectRatio: 1.75, // Adjust for desired width/height ratio
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false, // Using 24-hour format often simpler
        hour12: false
      },
      eventClick: this.onEventClick.bind(this),
      dateClick: this.onDateClick.bind(this),
      editable: true, // Allows dragging and resizing events (if backend supports update on drop/resize)
      eventDrop: this.onEventDrop.bind(this), // Handle event drag-and-drop
      // eventResize: this.onEventResize.bind(this), // Handle event resize
      displayEventEnd: true // Show event end times
    };
  }

  loadInterviews(): void {
    this.interviewService.getAllInterviews().subscribe({
      next: (interviews) => {
        if (this.calendarOptions) { // Ensure calendarOptions is initialized
          this.calendarOptions.events = interviews.map((interview) => ({
            id: interview.interviewId?.toString(),
            title: interview.location, // Or a more descriptive title like "Interview: " + interview.notes.slice(0,10)
            start: interview.dateInterview, // Should be ISO string or Date object
            // end: interview.endDate, // If interviews have an end time/date
            allDay: false, // Assuming interviews are not all-day events by default
            // extendedProps can hold more data
            extendedProps: {
              notes: interview.notes,
              status: interview.status,
              location: interview.location // Keep original location here if title is different
            },
            // Color coding based on status
            backgroundColor: this.getEventColor(interview.status),
            borderColor: this.getEventColor(interview.status)
          }));
        }
      },
      error: (err) => {
        console.error("Error loading interviews for calendar:", err);
        alert("Could not load interviews for the calendar. " + (err.error?.message || err.message));
      }
    });
  }
  
  getEventColor(status: InterviewStatus | string | undefined): string {
    switch (status) {
      case InterviewStatus.SCHEDULED: return 'var(--color-info)'; // Using info color from styles.css
      case InterviewStatus.COMPLETED: return 'var(--color-success)';
      case InterviewStatus.CANCELED: return 'var(--color-danger)';
      default: return 'var(--color-secondary)';
    }
  }


  onDateClick(arg: DateClickArg): void {
    this.initializeFormForAdd(arg.dateStr);
  }

  onEventClick(arg: EventClickArg): void {
    const interviewId = parseInt(arg.event.id || '0', 10);
    if (!interviewId) return;

    this.interviewService.getInterviewById(interviewId).subscribe({
      next: (interview) => {
        this.selectedInterview = interview;
        this.initializeForm(interview); // Populate form with fetched full details
        this.showForm = true;
      },
      error: (err) => {
        console.error("Error fetching interview details for edit:", err);
        alert("Could not load interview details for editing. " + (err.error?.message || err.message));
      }
    });
  }
  
  onEventDrop(arg: any): void { // type should be EventDropArg from FullCalendar
    if (!arg.event.id) return;
    const interviewId = parseInt(arg.event.id, 10);
    const newStartDate = arg.event.start;

    if (confirm(`Are you sure you want to move this interview to ${newStartDate?.toLocaleDateString()}?`)) {
      // Find the original interview to get all its data
      this.interviewService.getInterviewById(interviewId).subscribe(originalInterview => {
        const updatedInterview: Interview = {
          ...originalInterview,
          dateInterview: newStartDate ? newStartDate.toISOString() : originalInterview.dateInterview, // Update date
        };
        this.interviewService.updateInterview(updatedInterview).subscribe({
          next: () => {
            alert('Interview date updated successfully.');
            this.loadInterviews(); // Refresh events
          },
          error: (err) => {
            console.error('Failed to update interview date:', err);
            alert('Failed to update interview date. ' + (err.error?.message || err.message));
            arg.revert(); // Revert event to original position on error
          }
        });
      });
    } else {
      arg.revert();
    }
  }


  saveInterview(): void {
    if (this.interviewForm.invalid) {
      this.interviewForm.markAllAsTouched();
      alert('Please fill out all required fields correctly.');
      return;
    }

    const formValue = this.interviewForm.value;
    const interviewToSave: Interview = {
      ...this.selectedInterview, // Spread existing data if editing (like ID)
      ...formValue, // Spread form values (date, location, notes, status)
      dateInterview: new Date(formValue.dateInterview).toISOString() // Ensure ISO format for backend
    };
    
    // Remove interviewId from formValue before creating a new interview
    if (!this.selectedInterview) {
        delete interviewToSave.interviewId; 
    }


    const operation = this.selectedInterview && this.selectedInterview.interviewId
      ? this.interviewService.updateInterview(interviewToSave)
      : this.interviewService.addInterview(interviewToSave);

    operation.subscribe({
      next: () => {
        alert(`Interview ${this.selectedInterview ? 'updated' : 'added'} successfully.`);
        this.loadInterviews();
        this.closeForm();
      },
      error: (err) => {
        console.error(`Error ${this.selectedInterview ? 'updating' : 'adding'} interview:`, err);
        alert(`Failed to ${this.selectedInterview ? 'update' : 'add'} interview. ` + (err.error?.message || err.message));
      }
    });
  }

  deleteInterview(id: number | undefined): void {
    if (id === undefined) {
      alert('Cannot delete: Interview ID is missing.');
      return;
    }
    if (confirm("Are you sure you want to delete this interview?")) {
      this.interviewService.deleteInterview(id).subscribe({
        next: () => {
          alert('Interview deleted successfully.');
          this.loadInterviews();
          this.closeForm(); // Close form if it was open for this interview
        },
        error: (err) => {
          console.error('Error deleting interview:', err);
          alert('Failed to delete interview. ' + (err.error?.message || err.message));
        }
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedInterview = null;
    this.interviewForm.reset({ status: InterviewStatus.SCHEDULED }); // Reset with default status
  }
}
