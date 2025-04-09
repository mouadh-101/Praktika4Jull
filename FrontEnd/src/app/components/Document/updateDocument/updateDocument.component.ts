import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Duree, StatusDoc, Type } from 'src/app/Models/document';
import { DocumentService } from 'src/app/services/Document/Document.service';

@Component({
  selector: 'app-updateDocument',
  templateUrl: './updateDocument.component.html',
  styleUrls: ['./updateDocument.component.css']
})
export class UpdateDocumentComponent implements OnInit {
  documentForm: FormGroup;
  documentId!: number;
  types= Object.values(Type);
  durees= Object.values(Duree);
  statusList= Object.values(StatusDoc);

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.documentForm = this.fb.group({
      societe: ['', Validators.required],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      duree: ['', Validators.required],
      statusDoc: [StatusDoc.ENATTEND, Validators.required]
    });
  }

  ngOnInit(): void {
    this.documentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.documentId) {
      this.chercherDocument(this.documentId);
    }
  }
  onDureeChange() {
    const duree = this.documentForm.get('duree')?.value;
    const dateDebut = new Date(this.documentForm.get('dateDebut')?.value);

    if (!isNaN(dateDebut.getTime())) {
      let joursAjoutes = 0;

      switch (duree) {
        case Duree.DeuxMois:
          joursAjoutes = 60; // Approximation de 2 mois
          break;
        case Duree.SixMois:
          joursAjoutes = 180; // Approximation de 6 mois
          break;
      }

      if (joursAjoutes > 0) {
        const dateFin = new Date(dateDebut);
        dateFin.setDate(dateDebut.getDate() + joursAjoutes);
        this.documentForm.patchValue({ dateFin: dateFin.toISOString().split('T')[0] });
      }
    }
  }


  // Chercher un document par ID
  chercherDocument(id: number): void {
    this.documentService.chercherDocument(id).subscribe(
      
      response => {
        const dateDebut = new Date(response.dateDebut).toISOString().split('T')[0];
        const dateFin = new Date(response.dateFin).toISOString().split('T')[0];
        this.documentForm.patchValue({
          societe: response.societe,
          type: response.type,
          dateDebut: dateDebut,
          dateFin: dateFin,
          duree: response.duree,
          statusDoc: response.statusDoc
        });
      },
      error => console.error('Erreur lors de la récupération du document', error)
    );
  }

  // Mettre à jour un document
  updateDocument(): void {
    if (this.documentForm.valid) {
      const document = this.documentForm.value;
      this.documentService.updateDocument(document, this.documentId).subscribe(
        response => {
          console.log('Document mis à jour avec succès', response);
          this.router.navigate(['/ListDocument']); // Rediriger vers la liste des documents
        },
        error => console.error('Erreur lors de la mise à jour du document', error)
      );
    }
  }
}