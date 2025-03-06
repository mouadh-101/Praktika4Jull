import { Component, OnInit } from '@angular/core';
import { Document, Duree, StatusDoc } from 'src/app/Models/document';
import { DocumentService } from 'src/app/services/Document/Document.service';

@Component({
  selector: 'app-DocumentBack',
  templateUrl: './DocumentBack.component.html',
  styleUrls: ['./DocumentBack.component.css']
})
export class DocumentBackComponent implements OnInit {

  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  selectedDuree: Duree | '' = '';
  selectedStatus: StatusDoc | '' = ''; // Ajout pour le filtrage par statut
  public Duree = Duree;
  public StatusDoc = StatusDoc; // Ajouter la référence à StatusDoc
  page: number = 1;
  itemsPerPage: number = 6;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.chargerDocuments();
  }

  // Fonction de filtrage par durée et statut
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


  // Charger les documents
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

  telechargerDemandeStage(id: number): void {
    this.documentService.telechargerDemandeStage(id).subscribe(response => {
      this.telechargerFichier(response, 'demande_stage.pdf');
    }, error => {
      console.error('Erreur lors du téléchargement', error);
    });
  }

  telechargerLettreAffectation(id: number): void {
    this.documentService.telechargerLettreAffectation(id).subscribe(response => {
      this.telechargerFichier(response, 'lettre_affectation.pdf');
    }, error => {
      console.error('Erreur lors du téléchargement', error);
    });
  }

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

  estDesactive(status: StatusDoc): boolean {
    return status === StatusDoc.ENATTEND || status === StatusDoc.REFUSER;
  }

  estDesactivee(status: StatusDoc): boolean {
    return status === StatusDoc.ENATTEND;
  }

  estDesactiveee(status: StatusDoc): boolean {
    return status === StatusDoc.REFUSER || status === StatusDoc.VALIDE;
  }

  validerDocument(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir valider ce document ?')) {
      this.documentService.validerDocument(id).subscribe({
        next: () => {
          const document = this.documents.find(doc => doc.docid === id);
          if (document) {
            document.statusDoc = StatusDoc.VALIDE;
          }
          alert('Document validé avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la validation', err);
          alert('Erreur lors de la validation du document');
        }
      });
    }
  }

  refuserDocument(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir refuser ce document ?')) {
      this.documentService.refuserDocument(id).subscribe({
        next: () => {
          const document = this.documents.find(doc => doc.docid === id);
          if (document) {
            document.statusDoc = StatusDoc.REFUSER;
          }
          alert('Document refusé avec succès');
        },
        error: (err) => {
          console.error('Erreur lors du refus', err);
          alert('Erreur lors du refus du document');
        }
      });
    }
  }
}
