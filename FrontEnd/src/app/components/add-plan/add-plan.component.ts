import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { PlanDeTravail } from 'src/app/models/plan-de-travail.model';
import { PlanService } from 'src/app/services/Plan.service';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.css']
})
export class AddPlanComponent {
  planForm: FormGroup;

  constructor(private fb: FormBuilder, private planService: PlanService, private router :Router) {
    this.planForm = this.fb.group({
      description: ['', Validators.required],
      problematique: ['', Validators.required],
      fonctionnalites: ['', Validators.required],
      technologies: ['', Validators.required],
      statut: ['REMIS', Validators.required],
      fichierRemis: ['', Validators.required],
      encadrantInterne: ['', Validators.required],
      encadrantExterne: ['', Validators.required],
      company:['', Validators.required],
      planning: this.fb.array([])
    });
  }

  get planning(): FormArray {
    return this.planForm.get('planning') as FormArray;
  }

  addTache(): void {
    const tacheForm = this.fb.group({
      nomTache: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });
    this.planning.push(tacheForm);
  }

  removeTache(index: number): void {
    this.planning.removeAt(index);
  }

  onSubmit(): void {
  

    this.planService.addPlan(this.planForm.value).subscribe({
      next: (res) => {
        console.log('Plan ajouté avec succès', res);
       
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout', err);
        this.router.navigate(['/plans']);
      }
    });
    
  }
}
