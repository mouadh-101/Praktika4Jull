import { Component, OnInit } from '@angular/core';
import { ConventionService } from '../../services/convention.service';
import { Convention, Terms } from '../../core/model/db';
import {Router} from "@angular/router"; // Assurez-vous que le modèle Convention est correctement défini

@Component({
  selector: 'app-convention',
  templateUrl: './convention.component.html',
  styleUrls: ['./convention.component.css']
})
export class ConventionComponent implements OnInit {
  conventions: Convention[] = [];  // Liste des conventions récupérées depuis l'API
  terms: Terms[] = [];  // Liste des termes associés aux conventions

  // Nouvelle convention en cours de création
  newConvention: Convention = {
    conId: 0,
    dateConv: new Date(),
    description: '',
    signed: false,
    internshipId: 0,
    terms: []
  };

  constructor(private conventionService: ConventionService,private router: Router) {}

  ngOnInit(): void {
    this.loadConventions();  // Charger les conventions au démarrage du composant
  }

  // Méthode pour ajouter une convention
  addConvention(): void {
    this.conventionService.addConvention(this.newConvention).subscribe(
      (response) => {
        console.log('Convention ajoutée avec succès', response);
        this.loadConventions(); // Optionnel: pour recharger les conventions après l'ajout
        this.resetNewConvention(); // Réinitialiser la nouvelle convention
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la convention', error);
      }
    );
  }

  // Méthode pour ajouter un terme à la convention
  addTerm(): void {
    const newTerm: Terms = { title: '', description: '' }; // Créer un terme vide
    this.newConvention.terms.push(newTerm); // Ajouter le terme à la liste des termes
  }

  // Méthode pour charger toutes les conventions
  loadConventions(): void {
    this.conventionService.getAllConventions().subscribe(
      (data) => {
        this.conventions = data;  // Assigner les données récupérées à la liste des conventions
      },
      (error) => {
        console.error('Erreur lors du chargement des conventions', error);  // Afficher l'erreur dans la console
      }
    );
  }
  // Angular component method to delete a convention

    deleteConvention(conId: number | undefined) {
    if (conId === undefined) {
      console.error('convention ID is undefined');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette convention ?')) {
      this.conventionService.deleteConvention(conId).subscribe(() => {
        this.loadConventions();  // Recharger la liste après suppression
      });
    }
  }
  viewConvention(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/conventions', id]);
    } else {
      console.error('ID du convention non défini');
    }
  }
  // Méthode pour réinitialiser la nouvelle convention après l'ajout
  resetNewConvention(): void {
    this.newConvention = {
      conId: 0,
      dateConv: new Date(),
      description: '',
      signed: false,
      internshipId: 0,
      terms: []
    };
  }
}
