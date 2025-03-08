import { Component, OnInit } from '@angular/core';
import { Internship } from 'src/app/models/internship';
import { InternshipService } from 'src/app/services/internship.service';
import * as moment from 'moment';  
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.css']
})
export class InternshipComponent implements OnInit {
  internships: Internship[] = [];
  p: number = 1; // Page initiale
  filters = { // Object des critères de filtrage
    location: '',
    duration: null,
    compensation: null,
    field: '',
    remote: false
  };
  userRole: string = ''; 
  

  constructor(private router: Router,private internshipService: InternshipService,private userService: UserService) {}




  // Méthode pour récupérer les stages en fonction des filtres
  getInternships() {
    this.internshipService.getFilteredInternships(this.filters).subscribe(
      (data) => {
        this.internships = data; // Mettre à jour la liste des stages
      },
      (error) => {
        console.error('Error fetching internships', error);
      }
    );
  }

   // Méthode qui applique les filtres
   applyFilters() {
    // Utilise les filtres pour faire une requête GET
    this.internshipService.getFilteredInternships(this.filters).subscribe(data => {
      this.internships = data; // Mettez à jour la liste des internships
    });
  }


  // Charger les internships
loadInternships() {
  this.internshipService.getMatchingInternship().subscribe(data => {
    this.internships = data.map(internship => {
      // Ajouter le champ relativeTime à chaque internship
      return {
        ...internship,
        relativeTime: this.getRelativeTime(internship.createAt) // Assurez-vous que la propriété date existe
      };
    });

    console.log("Internships loaded:", this.internships); // Vérifier les données
  });
}


ngOnInit() {
  this.loadInternships();
  this.getUserRole(); // Ajoute les parenthèses pour exécuter la fonction
}

getUserRole() {
  this.userService.getUserData().subscribe(
    (userData) => {
      this.userRole = userData.role; // Assurez-vous que le backend renvoie un champ "role"
      console.log('Rôle de l\'utilisateur:', this.userRole); // Affichage dans la console
    },
    (error) => {
      console.error('Erreur lors de la récupération du rôle utilisateur', error);
    }
  );
}

// Naviguer vers les détails de l'internship
goToDetails(id: number) {
  this.router.navigate(['/internships/details', id]);
}

// Editer un internship
editInternship(id: number, event: Event) {
  event.stopPropagation();  // Empêche la redirection liée à la carte

  this.router.navigate(['/internships/edit', id]);
}

// Supprimer un internship
deleteInternship(id: number, event: Event) {
  event.stopPropagation();  // Empêche la redirection liée à la carte

  if (confirm('Are you sure you want to delete this internship?')) {
    this.internshipService.deleteInternship(id).subscribe(() => {
      this.loadInternships();  // Actualiser la liste des internships
      this.router.navigate(['/internships']);  // Redirige après la suppression
    });
  }
}
  
 
  // Fonction pour obtenir le temps relatif (ex: "1 day ago", "today")
  getRelativeTime(date: string | undefined): string {
    if (date) {
      return moment(date).fromNow(); // Affiche "today", "1 day ago", etc.
    } else {
      return "Date non disponible"; // Si la date est indéfinie, retourne un message par défaut
    }
  }
}
