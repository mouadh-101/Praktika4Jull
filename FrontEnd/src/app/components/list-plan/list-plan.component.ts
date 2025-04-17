import { Component } from '@angular/core';
import { PlanDeTravail } from 'src/app/models/plan-de-travail.model';
import { PlanService } from 'src/app/services/Plan.service';

@Component({
  selector: 'app-list-plan',
  templateUrl: './list-plan.component.html',
  styleUrls: ['./list-plan.component.css']
})
export class ListPlanComponent {
  plans: PlanDeTravail[] = [];

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.planService.getAllPlans().subscribe(
      (data) => {
        this.plans = data;
      },
      (error) => {
        console.error('Error loading plans', error);
      }
    );
  }
  downloadPlan(id: number): void {
    this.planService.downloadPlan(id).subscribe((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `plan_de_travail_${id}.pdf`; // Nom du fichier
      link.click();
    });
  }
}
