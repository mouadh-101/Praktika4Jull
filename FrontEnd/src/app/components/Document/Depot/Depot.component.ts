import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Depot } from 'src/app/Models/Depot';
import { DepotService } from 'src/app/services/Document/Depot.service';

@Component({
  selector: 'app-Depot',
  templateUrl: './Depot.component.html',
  styleUrls: ['./Depot.component.css']
})
export class DepotComponent implements OnInit {
  
  depotId!: number;
  uploadForm: FormGroup;
  messageType: 'success' | 'danger' = 'success';
  message: string | null = null;
  depots!: Depot;

  constructor(private formBuilder: FormBuilder, private depotService: DepotService, private route: ActivatedRoute) {
    this.uploadForm = this.formBuilder.group({
      Rapport: [''],
      Journal: [''],
      Attestation: ['']
    });
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
  
  onSubmit(): void {
    if (this.uploadForm.valid && this.depotId) {
      const Rapport = this.uploadForm.get('Rapport')?.value;
      const Journal = this.uploadForm.get('Journal')?.value;
      const Attestation = this.uploadForm.get('Attestation')?.value;

      if (this.depots) {
        // Mise à jour des documents existants
        this.depotService.updateRessource(this.depots.idDepot, Rapport, Journal, Attestation).subscribe(
          () => {
            this.messageType = 'success';
            this.message = 'Documents mis à jour avec succès !';
            this.loadDepotData();
          },
          (error) => {
            this.messageType = 'danger';
            this.message = 'Erreur lors de la mise à jour des documents';
            console.error('Erreur lors de la mise à jour des documents :', error);
          }
        );
      } else {
        // Ajout de nouveaux documents
        this.depotService.addDocument(Rapport, Journal, Attestation, this.depotId).subscribe(
          () => {
            this.messageType = 'success';
            this.message = 'Documents téléchargés avec succès !';
            this.loadDepotData();
          },
          (error) => {
            this.messageType = 'danger';
            this.message = 'Erreur lors du téléchargement des documents';
            console.error('Erreur lors du téléchargement des documents :', error);
          }
        );
      }
    } else {
      console.error('Formulaire invalide ou identifiant de dépôt manquant');
    }
  }


  
  onFileChanged(event: Event, field: string): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      console.log(`File selected for ${field}:`, file);
      this.uploadForm.patchValue({
        [field]: file
      });
    } else {
      console.log(`No file selected for ${field}`);
    }
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
  onDelete(depotId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) {
      this.depotService.deleteDepot(depotId).subscribe({
        next: () => {
          alert('Dépôt supprimé avec succès');
          // Redirigez l'utilisateur ou mettez à jour l'interface en conséquence
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du dépôt :', err);
          alert('Une erreur est survenue lors de la suppression du dépôt');
        },
      });
    }
  }

  updateFile(id: number, Rapport: File, Journal: File, Attestation: File): void {
    if (window.confirm('Do you to updadet it?')){
   
  
    this.depotService.updateRessource(id, Rapport, Journal, Attestation).subscribe(
      () => {
        this.message = 'File updated successfully';
        this.messageType = 'success';
  
        console.log('Agreement updated successfully');
      },
      (error) => {
        this.message = 'Error updating file';
        this.messageType = 'danger';
        console.error('Error updating file:', error);
      }
    );
  }
  

}
isFileAlreadyUploaded(): boolean {
  return this.depots !== undefined && this.depots !== null;
}

isFileAdded(): boolean {
  return this.depots !== undefined && this.depots !== null;
}

}  