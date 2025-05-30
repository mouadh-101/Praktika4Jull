import { HttpClient } from '@angular/common/http'; // Not used directly, can be removed if PlanService handles all HTTP
import { Component, OnInit } from '@angular/core'; // Added OnInit
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router'; // Corrected import for Router
import { PlanDeTravail, StatutPlan } from 'src/app/models/plan-de-travail.model'; // Assuming StatutPlan might be useful
import { PlanService } from 'src/app/services/Plan.service';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.css']
})
export class AddPlanComponent implements OnInit { // Implemented OnInit
  planForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private planService: PlanService,
    private router: Router
  ) {}

  ngOnInit(): void { // Moved form initialization to ngOnInit
    this.planForm = this.fb.group({
      description: ['', Validators.required],
      problematique: ['', Validators.required],
      fonctionnalites: ['', Validators.required],
      technologies: ['', Validators.required],
      statut: [StatutPlan.REMIS, Validators.required], // Default status, ensure StatutPlan.REMIS is valid
      fichierRemis: ['', Validators.required], // Assuming this is a string (name/link) for now
      encadrantInterne: ['', Validators.required],
      encadrantExterne: ['', Validators.required],
      company: this.fb.group({ // Assuming company is an object with at least a name
        company: ['', Validators.required] // Changed from simple string to a group control to match original formGroupName
      }),
      planning: this.fb.array([]) // Initialize as empty FormArray
    });
  }

  get planning(): FormArray {
    return this.planForm.get('planning') as FormArray;
  }

  createTacheFormGroup(): FormGroup { // Renamed for clarity from newTache
    return this.fb.group({
      nomTache: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
      // Add validator for dateFin after dateDebut if needed
    });
  }

  addTache(): void {
    this.planning.push(this.createTacheFormGroup());
  }

  removeTache(index: number): void {
    this.planning.removeAt(index);
  }

  onSubmit(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched(); // Show validation errors
      alert('Please fill out all required fields correctly and add at least one task if required.');
      // Consider checking if planning FormArray is empty if at least one task is mandatory
      // if (this.planning.length === 0) { /* alert for adding tasks */ }
      return;
    }
    
    // Prepare data for submission, ensure company structure matches backend expectations
    const formValue = this.planForm.value;
    const planDataToSubmit: PlanDeTravail = {
      ...formValue,
      company: formValue.company.company // Extract the company name string
      // If backend expects company as an object {name: '...'}, then:
      // company: { name: formValue.company.company }
    };


    this.planService.addPlan(planDataToSubmit).subscribe({
      next: (res) => {
        console.log('Work Plan added successfully', res);
        alert('Work Plan created successfully!');
        this.router.navigate(['/plans']); // Navigate to the list of plans
      },
      error: (err) => {
        console.error('Error adding Work Plan', err);
        alert('Failed to create Work Plan. ' + (err.error?.message || err.message));
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/plans']); // Navigate to the list of plans or previous page
  }
}
