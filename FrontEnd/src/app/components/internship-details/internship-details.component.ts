import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Internship } from 'src/app/models/internship';
import { FavoriService } from 'src/app/services/favori.service';
import { InternshipService } from 'src/app/services/internship.service';
import { MatDialog } from '@angular/material/dialog';
import { AddApplicationDialogComponent } from '../add-application/add-application.component';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.component.html',
  styleUrls: ['./internship-details.component.css']
})
export class InternshipDetailsComponent implements OnInit {
  internship!: Internship;
  isFavori: boolean = false; // Variable pour suivre l'état du favori
  users: any[] = [];
  selectedUserId: string = ''; // ID du stagiaire sélectionné
  userId!:string;

 constructor(private route: ActivatedRoute,private internshipService: InternshipService,private favorisService:FavoriService,private userService:UserService ,private chatService : ChatService, private dialog: MatDialog ) {}

 ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.internshipService.getInternshipById(id).subscribe(data => {
    this.internship = data;
  });
   // Vérifier si l'internship est déjà un favori à l'initialisation
   //const userId = '884a3a85-cc96-4294-9036-536905683478';  // Mettre ici l'ID de l'utilisateur connecté
   this.loadUsers();
   console.log('Liste des utilisateurs:', this.users);
   this.getUserid();
   this.checkFavori(this.userId, this.internship.id);


}


getUserid(): void {
  this.userService.getUserData().subscribe(
    (userData) => {
      this.userId = userData.userId;
      console.log('ID de l\'utilisateur connecté:', this.userId);
      this.chatService.connect(this.userId);
    },
    (error) => {
      console.error('Erreur lors de la récupération du rôle utilisateur', error);
    }
  );
}

 // Charger les utilisateurs (stagiaires)
 loadUsers(): void {
  this.userService.getUsers().subscribe(data => {
    this.users = data;
  });

}

// Ouvrir le modal
openShareModal(): void {
  const modalElement = document.getElementById('shareModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// Envoyer le stage sous forme de message
sendInternshipMessage(): void {
  if (!this.selectedUserId) {
    alert('Veuillez sélectionner un stagiaire.');
    return;
  }
  const internshipUrl = `https://ton-site.com/internship/${this.internship.id}`;
  const messageData = {
    senderId: this.userId,
    receiverId: this.selectedUserId,
    content: `Je te recommande ce stage : **${this.internship.titre}** chez **${this.internship.company?.description}**.\n
              📍 Lieu : ${this.internship.location}\n
              📅 Début : ${this.internship.startDate}\n
              🕒 Durée : ${this.internship.duration} mois\n
              💰 Rémunération : ${this.internship.compensation}€\n
             🔗 Voir plus : ${internshipUrl}`
  };

  this.chatService.sendMessage(messageData); // ✅ Envoi du message via WebSocket
  alert('Stage envoyé dans la messagerie avec succès !');

  // ✅ Fermer le modal si présent
  const modalElement = document.getElementById('shareModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }
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
  const userId = '884a3a85-cc96-4294-9036-536905683478';  // ID de l'utilisateur connecté

  if (this.isFavori) {
      console.log("🔍 ID envoyé pour suppression :", Number(this.route.snapshot.paramMap.get('id')));
this.favorisService.removeFavori(Number(this.route.snapshot.paramMap.get('id'))).subscribe(
  response => {
  console.log("✅ Favori supprimé avec succès");
}, error => {
  console.error("❌ Erreur lors de la suppression :", error);
});


  } else {
    // Ajouter le favori
    this.favorisService.addFavoris(this.internship.id).subscribe(
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
  // Appel au service pour ajouter ou supprimer un favori
  this.favorisService.addFavoris(this.internship.id).subscribe(
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

onApplyClicked(id:number)
{
  const dialogRef = this.dialog.open(AddApplicationDialogComponent, {
    width: '500px', // Set the width of the dialog
    data: {internshipId: id} // Pass the internshipId to the dialog
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      console.log('Application submitted successfully');
      alert("Application submitted successfully")
    } else {
      console.log('Application canceled');
    }
  });
}


}
