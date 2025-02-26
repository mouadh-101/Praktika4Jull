import { Component } from '@angular/core';
import {Convention} from "../../core/model/db";
import {ActivatedRoute, Router} from "@angular/router";
import {ConventionService} from "../../services/convention.service";

@Component({
  selector: 'app-convention-detail',
  templateUrl: './convention-detail.component.html',
  styleUrls: ['./convention-detail.component.css']
})
export class ConventionDetailComponent {
  convention: Convention | null = null;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private conventionService: ConventionService
  ) {}

  ngOnInit(): void {
    this.loadConvention();
  }

  loadConvention(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.conventionService.getConventionById(id).subscribe(
          (data) => {
            this.convention = data;
          },
          (error) => {
            console.error('Erreur lors du chargement de la convention', error);
          }
      );
    }
  }

  // Méthode pour revenir à la liste des conventions
  returnToList(): void {
    this.router.navigate(['/conventions']);
  }
}
