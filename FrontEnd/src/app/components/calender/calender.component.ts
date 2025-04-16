import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { InterviewService, Interview } from 'src/app/services/interview.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  calendarOptions: CalendarOptions;
  interviewForm: FormGroup;
  selectedInterview: Interview | null = null;
  showForm: boolean = false; // ⬅️ Contrôle de l'affichage du formulaire

  constructor(
    private interviewService: InterviewService,
    private fb: FormBuilder
  ) {
    this.interviewForm = this.fb.group({
      dateInterview: ['', Validators.required],
      location: ['', Validators.required],
      notes: [''],
      status: ['SCHEDULED', Validators.required]
    });

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      plugins: [dayGridPlugin, interactionPlugin],
      events: [],
      height: 'auto',
      aspectRatio: 1.5,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: 'short'
      },
      eventClick: this.onEventClick.bind(this),
      dateClick: this.onDateClick.bind(this) // ⬅️ Gestion du clic sur une date
    };
  }

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewService.getAllInterviews().subscribe((interviews) => {
      this.calendarOptions.events = interviews.map((interview) => ({
        id: interview.interviewId?.toString(),
        title: interview.location,
        start: interview.dateInterview,
        description: interview.notes,
        status: interview.status
      }));
    });
  }

  // 🔹 CLIC SUR UNE DATE -> Affiche le formulaire avec la date sélectionnée
  onDateClick(arg: any): void {
    this.selectedInterview = null; // Assure qu'on fait un ajout et non une modification
    this.showForm = true; // Affiche le formulaire
    this.interviewForm.reset(); // Réinitialise le formulaire
    this.interviewForm.patchValue({
      dateInterview: arg.dateStr // Prend la date cliquée
    });
  }

  // 🔹 CLIC SUR UN ÉVÉNEMENT -> Charge les infos dans le formulaire
  onEventClick(arg: any): void {
    const interviewId = parseInt(arg.event.id, 10);
    this.interviewService.getInterviewById(interviewId).subscribe((interview) => {
      this.selectedInterview = interview;
      this.showForm = true; // Affiche le formulaire pour la modification
      this.interviewForm.patchValue(interview);
    });
  }

  // 🔹 AJOUT OU MODIFICATION
  saveInterview(): void {
    if (this.interviewForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const interview: Interview = this.interviewForm.value;
    const statusMapping: { [key: string]: string } = {
      "SCHEDULED": "SCHEDULED",
      "COMPLETED": "COMPLETED",
      "CANCELED": "CANCELED"
    };
    interview.status = statusMapping[interview.status] || "SCHEDULED";

    if (this.selectedInterview && this.selectedInterview.interviewId) {
      interview.interviewId = this.selectedInterview.interviewId;
      this.interviewService.updateInterview(interview).subscribe(() => {
        alert('Interview mise à jour avec succès');
        this.loadInterviews();
        this.closeForm();
      });
    } else {
      this.interviewService.addInterview(interview).subscribe(() => {
        alert('Interview ajoutée avec succès');
        this.loadInterviews();
        this.closeForm();
      });
    }
  }

  // 🔹 SUPPRIMER UNE INTERVIEW
  deleteInterview(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette interview ?")) {
      this.interviewService.deleteInterview(id).subscribe(() => {
        alert('Interview supprimée avec succès');
        this.loadInterviews();
        this.closeForm();
      });
    }
  }

  // 🔹 FERMER LE FORMULAIRE
  closeForm(): void {
    this.showForm = false;
    this.selectedInterview = null;
    this.interviewForm.reset();
  }
}

