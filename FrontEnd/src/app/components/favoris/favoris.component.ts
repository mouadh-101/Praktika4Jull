import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriService } from 'src/app/services/favori.service';

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css']
})
export class FavorisComponent implements OnInit{
  favoris: any[] = []; // Liste des internships favoris
  userId: string = 'd129e5cc-f0d8-43f8-96d6-65b29952f233'; // Remplace par l'ID réel de l'utilisateur

  constructor(private router: Router,private favoriService: FavoriService) {}

  ngOnInit(): void {
    this.getFavorisByUserId();
  }

  // Méthode pour récupérer les stages favoris d'un utilisateur
  getFavorisByUserId(): void {
    this.favoriService.getFavorisByUserId(this.userId).subscribe(
      (data) => {
        this.favoris = data;
        console.log('Stages favoris récupérés:', this.favoris);
      },
      (error) => {
        console.error('Erreur lors de la récupération des favoris', error);
      }
    );
  }
  goToDetails(id: number) {
    this.router.navigate(['/internships/details', id]);
  }
}
