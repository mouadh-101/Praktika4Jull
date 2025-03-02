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
  convention!: Convention;
  loading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private conventionService: ConventionService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.conventionService.getConventionById(+id).subscribe({
        next: (data) => {
          this.convention = data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des données';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'Identifiant de convention invalide';
      this.loading = false;
    }
  }

  returnToList() {
    this.router.navigate(['/conventions']);
  }
}
