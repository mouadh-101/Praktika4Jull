import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { InterviewService } from 'src/app/services/interview.service';
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin pour la vue "dayGrid"
import interactionPlugin from '@fullcalendar/interaction';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Vue par défaut : mois
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    plugins: [dayGridPlugin, interactionPlugin], // Ajouter les plugins nécessaires
    events: [],  // Initialiser un tableau vide pour les événements
    height: 'auto',  // Ajuster la hauteur automatiquement
    aspectRatio: 1.5, // Ajuster le rapport largeur/hauteur (1.5 par exemple)
    eventTimeFormat: { // Format de l'heure pour les événements
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short'
    }
  };

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    // Récupérer les interviews depuis le service
    this.interviewService.getAllInterviews().subscribe((interviews) => {
      // Mapper les interviews pour correspondre au format attendu par FullCalendar
      this.calendarOptions.events = interviews.map((interview) => ({
        start: new Date(interview.dateInterview).toISOString(), // Date de l'interview (format ISO)
        description: interview.notes, // Notes pour l'interview (facultatif)
        location: interview.location // Lieu de l'interview (facultatif)
      }));
    });
  }

}
