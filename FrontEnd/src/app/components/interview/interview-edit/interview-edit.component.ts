import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService, Interview } from 'src/app/services/interview.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-interview-edit',
  templateUrl: './interview-edit.component.html',
  styleUrls: ['./interview-edit.component.css']
})
export class InterviewEditComponent implements OnInit {
  interviewForm!: FormGroup;
  minDate: string = '';
  interviewId!: number; // Stocker l'ID de l'interview à mettre à jour

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Définir la date minimale (demain)
    const today = new Date();
    today.setDate(today.getDate() + 1);
    this.minDate = today.toISOString().split('T')[0];

    // 🔹 Initialisation du formulaire avec validation
    this.interviewForm = this.fb.group({
      dateInterview: ['', [Validators.required, this.futureDateValidator]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      notes: ['', [Validators.required, Validators.minLength(5)]],
      status: ['SCHEDULED', Validators.required]
    });

    // 🔹 Récupérer l'ID de l'interview depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.interviewId = +id;
      this.interviewService.getInterviewById(this.interviewId).subscribe(data => {
        if (data.dateInterview) {
          data.dateInterview = this.formatDateForInput(data.dateInterview); // ✅ Correction ici
        }
        this.interviewForm.patchValue(data);
      });
    }
  }

  // ✅ Fonction pour convertir la date au bon format pour <input type="date">
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Convertir en format YYYY-MM-DD
  }

  // ✅ VALIDATEUR PERSONNALISÉ POUR LA DATE
  futureDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? null : { invalidDate: true };
  }

  updateInterview(): void {
    if (this.interviewForm.invalid) {
      return;
    }

    // Ajout de l'ID avant d'envoyer les données au backend
    const updatedInterview: Interview = {
      interviewId: this.interviewId,
      ...this.interviewForm.value
    };

    this.interviewService.updateInterview(updatedInterview).subscribe(() => {
      this.router.navigate(['/interviews']);
    });
  }

  cancel(): void {
    this.router.navigate(['/interviews']);
  }
}
