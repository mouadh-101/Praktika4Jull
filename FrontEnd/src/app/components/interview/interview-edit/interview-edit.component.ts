import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from 'src/app/service/interview.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-interview-edit',
  templateUrl: './interview-edit.component.html',
  styleUrls: ['./interview-edit.component.css']
})
export class InterviewEditComponent implements OnInit {
  interviewForm!: FormGroup;
  minDate: string = '';

  constructor(
    private fb: FormBuilder,
    private interviewService: InterviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Définir la date minimale (demain)
    const today = new Date();
    today.setDate(today.getDate() + 1); // Demain
    this.minDate = today.toISOString().split('T')[0];

    // 🔹 Initialisation du formulaire avec validation
    this.interviewForm = this.fb.group({
      dateInterview: ['', [Validators.required, this.futureDateValidator]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      notes: ['', [Validators.required, Validators.minLength(5)]],
      status: ['SCHEDULED', Validators.required]
    });

    // 🔹 Charger les données de l'interview existante
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.interviewService.getInterviewById(+id).subscribe(data => {
        this.interviewForm.patchValue(data); // Remplir le formulaire avec les données actuelles
      });
    }
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
    this.interviewService.updateInterview(this.interviewForm.value).subscribe(() => {
      this.router.navigate(['/interviews']);
    });
  }

  cancel(): void {
    this.router.navigate(['/interviews']);
  }
}
