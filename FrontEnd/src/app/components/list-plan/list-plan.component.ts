import { Component, OnInit } from '@angular/core'; // Added OnInit
import { PlanDeTravail, StatutPlan } from 'src/app/models/plan-de-travail.model'; // Assuming StatutPlan might be part of model or needed for badges
import { PlanService } from 'src/app/services/Plan.service';

@Component({
  selector: 'app-list-plan',
  templateUrl: './list-plan.component.html',
  styleUrls: ['./list-plan.component.css']
})
export class ListPlanComponent implements OnInit { // Implemented OnInit
  plans: PlanDeTravail[] = [];
  isLoading: boolean = true;
  // For status badge styling, if StatutPlan enum is available and used in template
  // public StatutPlan = StatutPlan; 

  // Pagination (currently commented out in HTML, add back if list can be long)
  // page: number = 1;
  // itemsPerPage: number = 5; 

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading = true;
    this.planService.getAllPlans().subscribe({
      next: (data) => {
        this.plans = data.map(plan => ({
          ...plan,
          // Ensure date fields are Date objects if needed by pipes, though 'shortDate' handles strings/numbers
          planning: plan.planning?.map(tache => ({
            ...tache,
            dateDebut: tache.dateDebut ? new Date(tache.dateDebut) : undefined,
            dateFin: tache.dateFin ? new Date(tache.dateFin) : undefined,
          }))
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading plans:', error);
        alert('Failed to load work plans. ' + (error.error?.message || error.message));
        this.isLoading = false;
      }
    });
  }

  downloadPlan(id: number | undefined): void {
    if (!id) {
      alert('Cannot download: Plan ID is missing.');
      return;
    }
    this.planService.downloadPlan(id).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `work_plan_${id}.pdf`; // Nom du fichier
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link); // Clean up
        URL.revokeObjectURL(link.href); // Free up memory
        alert('Work plan downloaded successfully.');
      },
      error: (error) => {
        console.error('Error downloading plan:', error);
        alert('Failed to download work plan. ' + (error.error?.message || error.message));
      }
    });
  }

  // Placeholder for future actions like edit/delete if added to template
  // editPlan(id: number | undefined): void {
  //   if (!id) return;
  //   // this.router.navigate(['/edit-plan', id]);
  // }

  // deletePlan(id: number | undefined): void {
  //   if (!id) return;
  //   if (confirm('Are you sure you want to delete this work plan?')) {
  //     // this.planService.deletePlan(id).subscribe(...);
  //   }
  // }
}
