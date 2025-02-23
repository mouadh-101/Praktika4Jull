import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InterviewService } from 'src/app/service/interview.service';

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
    this.interviewService.addInterview(this.interviewForm.value).subscribe(() => {
      this.router.navigate(['/interviews']);
    });
  }

  cancel(): void {
    this.router.navigate(['/interviews']);
  }
}
