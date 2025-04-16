import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InterviewService } from 'src/app/services/interview.service';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-interview-add',
  templateUrl: './interview-add.component.html',
  styleUrls: ['./interview-add.component.css']
})
export class InterviewAddComponent implements OnInit {
  interviewForm!: FormGroup;
  minDate: string = '';

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Définir la date minimale (demain)
    const today = new Date();
    today.setDate(today.getDate() + 1); // Demain
    this.minDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD

    // 🔹 Initialisation du formulaire
    this.interviewForm = this.fb.group({
      dateInterview: ['', [Validators.required, this.futureDateValidator]], // Ajout du validateur personnalisé
      location: ['', [Validators.required, Validators.minLength(3)]],
      notes: ['', [Validators.required, Validators.minLength(5)]],
      status: ['', Validators.required]
    });
  }

  // ✅ VALIDATEUR PERSONNALISÉ POUR LA DATE
  futureDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Supprime l'heure pour comparer uniquement la date

    return selectedDate > today ? null : { invalidDate: true }; // Doit être STRICTEMENT supérieur
  }

  addInterview(): void {
    if (this.interviewForm.invalid) {
      return;
    }

    // Ajouter l'interview à la base de données
    this.interviewService.addInterview(this.interviewForm.value).subscribe(() => {

      // Après l'ajout réussi, envoyer un email
      this.sendEmail(this.interviewForm.value);

      // Redirection vers la liste des interviews
      this.router.navigate(['/interviews']);
    });
  }

  sendEmail(interviewData: any): void {
    const templateParams = {
      to_email: "hedi.latrache@esprit.tn",  // Remplace par l'email du candidat
      subject: "Nouvelle Interview Planifiée",
      message: `Votre interview est prévue le ${interviewData.dateInterview} à ${interviewData.location}. Notes: ${interviewData.notes}`
    };

    emailjs.send('service_id', 'template_id', templateParams, 'user_id')
      .then(() => {
        console.log('✅ Email envoyé avec succès !');
      })
      .catch((error) => {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      });
  }

  cancel(): void {
    this.router.navigate(['/interviews']);
  }
}
