import { Component, OnInit } from '@angular/core';
import {Convention, Terms} from 'src/app/core/model/db';
import { TermsService } from "../../services/terms.service";
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms"; // Import pour la gestion des formulaires
// Assurez-vous que le modèle Convention est bien importé

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  termsList: Terms[] = [];
  conventionsList: Convention[] = []; // Liste des conventions à afficher dans le formulaire

  newTerm: Terms = {
    title: '',
    description: '',

  };
  selectedTerm: Terms = { termId: 0, title: '', description: '' };
  constructor(private termsService: TermsService, private router: Router) {}

  ngOnInit(): void {
    this.loadTerms();
    this.loadConventions(); // Charger les conventions disponibles
  }

  loadTerms(): void {
    this.termsService.getAllTerms().subscribe((data) => {
      this.termsList = data;
    });
  }

  loadConventions(): void {
    this.termsService.getAllConventions().subscribe((data) => {
      this.conventionsList = data;
    });
  }
  // Méthode pour supprimer un terme
  deleteTerm(termId: number | undefined) {
    if (termId === undefined) {
      console.error('Term ID is undefined');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce terme ?')) {
      this.termsService.deleteTerm(termId).subscribe(() => {
        this.loadTerms();  // Recharger la liste après suppression
      });
    }
  }


  addTerm(): void {
    this.termsService.addTerms(this.newTerm).subscribe((data) => {
      this.termsList.push(data);
      // Fermer la modal après ajout
      const modal = document.getElementById('addTermModal') as any;
      modal?.modal('hide');
    });
  }

  onSubmit(termForm: NgForm): void {
    if (termForm.valid) {
      this.addTerm();
      termForm.resetForm(); // Réinitialiser le formulaire après soumission
    } else {
      // Optionnel : Vous pouvez aussi afficher un message pour informer l'utilisateur si le formulaire est invalide
      alert('Veuillez corriger les erreurs dans le formulaire.');
    }
  }



  // Fonction pour mettre à jour le terme
  updateTerm() {
    if (this.selectedTerm && this.selectedTerm.termId) {
      this.termsService.updateTerm(this.selectedTerm).subscribe(
        (response: Terms) => {
          alert('Terme mis à jour avec succès !');
          this.loadTerms(); // Recharger la liste après mise à jour
        },
        (error: any) => {
          alert('Erreur lors de la mise à jour du terme');
          console.error(error);
        }
      );
    }
  }
  editTerm(term: Terms) {
    this.selectedTerm = { ...term }; // Copie de l'objet pour éviter la liaison directe
  }

  // 🔹 Naviguer vers la page de détails d'un terme
  viewTerm(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/terms', id]);
    } else {
      console.error('ID du terme non défini');
    }
  }


}
