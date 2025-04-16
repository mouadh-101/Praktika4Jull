import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Depot } from 'src/app/Models/Depot';
import { DepotService } from 'src/app/services/Document/Depot.service';

@Component({
  selector: 'app-DepotBack',
  templateUrl: './DepotBack.component.html',
  styleUrls: ['./DepotBack.component.css']
})
export class DepotBackComponent implements OnInit {

 depotId!: number;

   depots!: Depot;
 
   constructor( private depotService: DepotService, private route: ActivatedRoute) {
  
   }
 
   ngOnInit(): void {
     this.depotId = this.route.snapshot.params['id'];  // Example: Get document ID from route
 
     this.loadDepotData(); // Charger les dépôts existants
   }
 
   loadDepotData(): void {
     this.depotService.getDepotByDocumntId(this.depotId).subscribe({
       next: (data) => {
         console.log('Depot data:', data); // Afficher l'objet pour vérifier
         if (data ) {  // Vérifier si c'est un objet valide
           this.depots = data;  // Affecter l'objet unique à la variable 'depot'
         } else {
           console.error('No valid depot data:', data);
         }
       },
       error: (err) => {
         console.error('Error fetching depot:', err);
       }
     });
   }
   
  
 
   download(id: number): void {
     this.depotService.downloadDocuments(id).subscribe({
       next: (response) => {
         // Créez un objet URL pour le Blob
         const blob = new Blob([response], { type: 'application/zip' });
         const url = window.URL.createObjectURL(blob);
 
         // Créez un élément <a> et déclenchez le téléchargement
         const a = document.createElement('a');
         a.href = url;
         a.download = 'documents.zip';
         a.click();
 
         // Libérez l'objet URL après utilisation
         window.URL.revokeObjectURL(url);
       },
       error: (err) => {
         console.error('Erreur lors du téléchargement du fichier', err);
       }
     });
   }

   
 
 }



