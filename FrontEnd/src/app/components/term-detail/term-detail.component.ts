import { Component } from '@angular/core';
import {Terms} from "../../core/model/db";
import {TermsService} from "../../services/terms.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-term-detail',
  templateUrl: './term-detail.component.html',
  styleUrls: ['./term-detail.component.css']
})
export class TermDetailComponent {
  term: Terms | undefined; // Déclare un terme unique
  selectedTerm: Terms = { termId: 0, title: '', description: '' }; // Terme sélectionné pour modification

  constructor(
    private termsService: TermsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTerm(); // Charger le terme lors de l'initialisation du composant
  }

  loadTerm(): void {
    const termId = Number(this.route.snapshot.paramMap.get('id')); // Récupérer l'ID du terme depuis l'URL
    if (termId) {
      this.termsService.getTermById(termId).subscribe(
        (data) => {
          this.term = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération du terme:', error);
        }
      );
    }
  }

  // Méthode pour supprimer un terme
  deleteTerm(termId: number | undefined) {
    if (termId === undefined) {
      console.error('Term ID is undefined');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce terme ?')) {
      this.termsService.deleteTerm(termId).subscribe(
        () => {
          this.router.navigate(['/terms']); // Naviguer vers la liste des termes après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression du terme:', error);
        }
      );
    }
  }

  // Fonction pour mettre à jour un terme
  updateTerm(): void {
    if (this.selectedTerm && this.selectedTerm.termId) {
      this.termsService.updateTerm(this.selectedTerm).subscribe(
        (response: Terms) => {
          alert('Terme mis à jour avec succès !');
          this.loadTerm(); // Recharger le terme après mise à jour
        },
        (error: any) => {
          alert('Erreur lors de la mise à jour du terme');
          console.error(error);
        }
      );
    }
  }

  editTerm(term: Terms) {
    this.selectedTerm = { ...term }; // Copie du terme sélectionné pour modification
  }

  // Naviguer vers la liste des termes
  viewTerm(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/terms', id]);
    } else {
      console.error('ID du terme non défini');
    }
  }
}
