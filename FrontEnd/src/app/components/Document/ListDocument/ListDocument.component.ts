import { Component, OnInit } from '@angular/core';
import { Document, Duree, StatusDoc } from 'src/app/Models/document';
import { DocumentService } from 'src/app/services/Document/Document.service';

@Component({
  selector: 'app-ListDocument',
  templateUrl: './ListDocument.component.html',
  styleUrls: ['./ListDocument.component.css']
})
export class ListDocumentComponent implements OnInit {

  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  selectedDuree: Duree | '' = ''; // Durée sélectionnée
  selectedStatus: StatusDoc | '' = ''; // Statut sélectionné
  public Duree = Duree;  // Pour accéder aux valeurs de durée
  public StatusDoc = StatusDoc; // Pour accéder aux valeurs de statut
  page: number = 1; // Page actuelle pour la pagination
  itemsPerPage: number = 6; // Nombre d'éléments par page
  qrCodeUrl: string = '';  // URL du QR Code généré


  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.chargerDocuments();
  }
  generateQRCodeUrl(docId: number): string {
    return `http://192.168.47.44:8088/api/Document/generateQRCode/${docId}`;
  }
  filterDocuments(): void {
    let filtered = this.documents;

    // Filtrage par durée
    if (this.selectedDuree) {
      filtered = filtered.filter(doc => doc.duree === this.selectedDuree);
    }

    // Filtrage par statut
    if (this.selectedStatus) {
      filtered = filtered.filter(doc => doc.statusDoc === this.selectedStatus);
    }

    this.filteredDocuments = filtered;
  }

  filterDocumentsByType(): void {
    this.filterDocuments(); // Appel de la méthode commune
  }


  // Charger tous les documents et appliquer les filtres
  chargerDocuments(): void {
    this.documentService.getDocuments().subscribe(data => {
      this.documents = data.map((doc: any) => {
        if (doc.DateDebut) {
          doc.DateDebut = new Date(doc.DateDebut);
        }
        if (doc.DateFin) {
          doc.DateFin = new Date(doc.DateFin);
        }
        return doc;
      });
      this.filteredDocuments = [...this.documents]; // Initialisation des documents filtrés
    }, error => {
      console.error('Erreur lors du chargement des documents', error);
    });
  }

  // Télécharger la demande de stage
  telechargerDemandeStage(id: number): void {
    this.documentService.telechargerDemandeStage(id).subscribe(response => {
      this.telechargerFichier(response, 'demande_stage.pdf');
    }, error => {
      console.error('Erreur lors du téléchargement', error);
    });
  }

  // Télécharger la lettre d'affectation
  telechargerLettreAffectation(id: number): void {
    this.documentService.telechargerLettreAffectation(id).subscribe(response => {
      this.telechargerFichier(response, 'lettre_affectation.pdf');
    }, error => {
      console.error('Erreur lors du téléchargement', error);
    });
  }

  // Fonction de téléchargement du fichier
  private telechargerFichier(response: Blob, filename: string): void {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Vérifier si un document est désactivé selon son statut
  estDesactive(status: StatusDoc): boolean {
    return status === StatusDoc.ENATTEND || status === StatusDoc.REFUSER;
  }

  // Vérifier si un document est désactivé selon un statut spécifique
  estDesactivee(status: StatusDoc): boolean {
    return status === StatusDoc.ENATTEND;
  }

  // Vérifier si un document est activé selon un statut spécifique
  estDesactiveee(status: StatusDoc): boolean {
    return status === StatusDoc.VALIDE;
  }

  // Supprimer un document
  supprimerDocument(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      this.documentService.supprimerDocument(id).subscribe({
        next: () => {
          this.documents = this.documents.filter(doc => doc.docid !== id);  // Retirer le document supprimé de la liste
          this.filteredDocuments = this.filteredDocuments.filter(doc => doc.docid !== id);  // Mettre à jour la liste filtrée
          alert('Document supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('Erreur lors de la suppression du document');
        }
      });
    }
  }
}
