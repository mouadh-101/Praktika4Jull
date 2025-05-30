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
  selectedStatus: StatusDoc | '' = '';
  public Duree = Duree; // Used in template
  public StatusDoc = StatusDoc; // Used in template
  page: number = 1;
  itemsPerPage: number = 10; // Increased items per page for admin view

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.chargerDocuments();
  }

  filterDocuments(): void {
    let filtered = this.documents;
    if (this.selectedDuree) {
      filtered = filtered.filter(doc => doc.duree === this.selectedDuree);
    }
    if (this.selectedStatus) {
      filtered = filtered.filter(doc => doc.statusDoc === this.selectedStatus);
    }
    this.filteredDocuments = filtered;
    this.page = 1; // Reset to first page after filtering
  }

  chargerDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: data => {
        this.documents = data.map((doc: any) => {
          // Assuming dates are already handled or are strings; if conversion needed, do it here.
          // Example: doc.dateDebut = new Date(doc.dateDebut);
          return doc;
        });
        this.filterDocuments(); // Apply initial empty filters to populate filteredDocuments
      },
      error: error => {
        console.error('Erreur lors du chargement des documents', error);
        alert('Error loading documents: ' + (error.message || 'Unknown error'));
      }
    });
  }

  telechargerDemandeStage(id: number): void {
    this.documentService.telechargerDemandeStage(id).subscribe({
      next: response => this.telechargerFichier(response, `demande_stage_${id}.pdf`),
      error: error => {
        console.error('Erreur lors du téléchargement de la demande', error);
        alert('Error downloading request document: ' + (error.message || 'Unknown error'));
      }
    });
  }

  telechargerLettreAffectation(id: number): void {
    this.documentService.telechargerLettreAffectation(id).subscribe({
      next: response => this.telechargerFichier(response, `lettre_affectation_${id}.pdf`),
      error: error => {
        console.error('Erreur lors du téléchargement de la lettre', error);
        alert('Error downloading assignment letter: ' + (error.message || 'Unknown error'));
      }
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
    window.URL.revokeObjectURL(url);
  }

  // Simplified disabling logic for view/download links (disabled if ENATTEND or REFUSER)
  estDesactive(status: StatusDoc): boolean {
    return status === StatusDoc.ENATTEND || status === StatusDoc.REFUSER;
  }

  // The logic for estDesactiveee (disabling validate/reject if already VALIDE or REFUSER)
  // is now directly in the template: [disabled]="document.statusDoc === StatusDoc.VALIDE || document.statusDoc === StatusDoc.REFUSER"
  // So, estDesactivee and estDesactiveee can be removed if not used elsewhere.

  validerDocument(id: number): void {
    if (confirm('Are you sure you want to approve this document?')) {
      this.documentService.validerDocument(id).subscribe({
        next: () => {
          const document = this.filteredDocuments.find(doc => doc.docid === id);
          if (document) {
            document.statusDoc = StatusDoc.VALIDE;
          }
          // Also update the main documents array if it's used for re-filtering
          const mainDoc = this.documents.find(doc => doc.docid === id);
          if (mainDoc) {
            mainDoc.statusDoc = StatusDoc.VALIDE;
          }
          alert('Document approved successfully.');
        },
        error: (err) => {
          console.error('Error approving document:', err);
          alert('Error approving document: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  refuserDocument(id: number): void {
    if (confirm('Are you sure you want to reject this document?')) {
      this.documentService.refuserDocument(id).subscribe({
        next: () => {
          const document = this.filteredDocuments.find(doc => doc.docid === id);
          if (document) {
            document.statusDoc = StatusDoc.REFUSER;
          }
           const mainDoc = this.documents.find(doc => doc.docid === id);
          if (mainDoc) {
            mainDoc.statusDoc = StatusDoc.REFUSER;
          }
          alert('Document rejected successfully.');
        },
        error: (err) => {
          console.error('Error rejecting document:', err);
          alert('Error rejecting document: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
