import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Duree, StatusDoc, Type } from 'src/app/Models/document';
import { DocumentService } from 'src/app/services/Document/Document.service';

@Component({
  selector: 'app-AddDocument',
  templateUrl: './AddDocument.component.html',
  styleUrls: ['./AddDocument.component.css']
})
export class AddDocumentComponent {
  documentForm: FormGroup;
  types = Object.values(Type);
  durees = Object.values(Duree);
  statusList = Object.values(StatusDoc);

  constructor(private fb: FormBuilder, private documentService: DocumentService, private router: Router) {
    this.documentForm = this.fb.group({
      societe: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      duree: ['', Validators.required],
      statusDoc: [StatusDoc.ENATTEND, Validators.required]
    });
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

  ajouterDocument() {
    if (this.documentForm.valid) {
      const document = this.documentForm.value;
      this.documentService.ajouterDocument(document).subscribe(
        response => {
          console.log('Document ajouté avec succès', response);
          this.router.navigate(['/ListDocument']);
        },
        error => console.error('Erreur lors de l\'ajout du document', error)
      );
    }
  }
}
