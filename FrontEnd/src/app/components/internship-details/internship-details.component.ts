import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Internship } from 'src/app/models/internship';
import { FavoriService } from 'src/app/services/favori.service';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.component.html',
  styleUrls: ['./internship-details.component.css']
})
export class InternshipDetailsComponent implements OnInit {
  internship!: Internship;
  isFavori: boolean = false; // Variable pour suivre l'état du favori
 constructor(private route: ActivatedRoute,private internshipService: InternshipService,private favorisService:FavoriService ) {}

 ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.internshipService.getInternshipById(id).subscribe(data => {
    this.internship = data;
  });
   // Vérifier si l'internship est déjà un favori à l'initialisation
   const userId = 'd129e5cc-f0d8-43f8-96d6-65b29952f233';  // Mettre ici l'ID de l'utilisateur connecté
   this.checkFavori(userId, this.internship.id);
}
// Fonction pour vérifier si l'internship est déjà un favori
checkFavori(userId: string, internshipId: number): void {
  // Logique pour vérifier si l'internship est déjà dans les favoris
  // Si oui, définir isFavori à true
  // Exemple basique : appel à l'API pour vérifier si le favori existe
  // (à adapter selon l'API de ton service backend)
  this.favorisService.checkFavori(userId, internshipId).subscribe(
    (response) => {
      this.isFavori = response ? true : false;
    },
    (error) => {
      console.error('Erreur lors de la vérification du favori', error);
    }
  );
}
 // Ajouter ou supprimer un favori
 toggleFavori(): void {
  const userId = 'd129e5cc-f0d8-43f8-96d6-65b29952f233';  // ID de l'utilisateur connecté

  if (this.isFavori) {
      console.log("🔍 ID envoyé pour suppression :", Number(this.route.snapshot.paramMap.get('id')));
this.favorisService.removeFavori(userId,Number(this.route.snapshot.paramMap.get('id'))).subscribe(
  response => {
  console.log("✅ Favori supprimé avec succès");
}, error => {
  console.error("❌ Erreur lors de la suppression :", error);
});

     
  } else {
    // Ajouter le favori
    this.favorisService.addFavoris(userId, this.internship.id).subscribe(
      (response) => {
        this.isFavori = true;  // Mettre à jour l'état du favori
        console.log('Favori ajouté:', response);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du favori', error);
      }
    );
  }
}


addFavori() {
  const userId = 'd129e5cc-f0d8-43f8-96d6-65b29952f233'; // Remplacer par l'ID de l'utilisateur connecté

  // Appel au service pour ajouter ou supprimer un favori
  this.favorisService.addFavoris(userId, this.internship.id).subscribe(
    (response) => {
      console.log('Favori ajouté:', response);
      this.isFavori = !this.isFavori; // Basculer l'état du favori
    },
    (error) => {
      console.error('Erreur lors de l\'ajout du favori', error);
    }
  );
}



goBack(): void {
  window.history.back();
}
}
