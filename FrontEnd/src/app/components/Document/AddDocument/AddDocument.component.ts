import { Component, OnInit } from '@angular/core'; // Added OnInit
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Duree, StatusDoc, Type } from 'src/app/Models/document';
import { DocumentService } from 'src/app/services/Document/Document.service';

@Component({
  selector: 'app-AddDocument',
  templateUrl: './AddDocument.component.html',
  styleUrls: ['./AddDocument.component.css']
})
export class AddDocumentComponent implements OnInit { // Implemented OnInit
  documentForm!: FormGroup; // Used definite assignment assertion
  types = Object.values(Type);
  durees = Object.values(Duree);
  // statusList is not used in the template, so can be removed if not needed elsewhere.

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router
  ) {} // Removed statusList initialization from constructor as it's not used in template

  ngOnInit(): void { // Added ngOnInit lifecycle hook
    this.documentForm = this.fb.group({
      societe: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [{ value: '', disabled: true }, Validators.required], // dateFin is calculated, so disable and keep required
      duree: ['', Validators.required],
      statusDoc: [StatusDoc.ENATTEND, Validators.required] // Default status
    });
  }

  onDureeChange(): void { // Corrected to void return type
    const duree = this.documentForm.get('duree')?.value;
    const dateDebutValue = this.documentForm.get('dateDebut')?.value;

    if (duree && dateDebutValue) {
      const dateDebut = new Date(dateDebutValue);
      if (!isNaN(dateDebut.getTime())) {
        let joursAjoutes = 0;
        switch (duree) {
          case Duree.DeuxMois: joursAjoutes = 60; break;
          case Duree.SixMois: joursAjoutes = 180; break;
          // Add other cases if Duree enum expands
        }

        if (joursAjoutes > 0) {
          const dateFin = new Date(dateDebut);
          dateFin.setDate(dateDebut.getDate() + joursAjoutes);
          this.documentForm.patchValue({ dateFin: dateFin.toISOString().split('T')[0] });
        } else {
          this.documentForm.patchValue({ dateFin: '' }); // Clear if duration is invalid or leads to no change
        }
      }
    } else {
      this.documentForm.patchValue({ dateFin: '' }); // Clear if no duration or start date
    }
  }

  ajouterDocument(): void { // Corrected to void return type
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched(); // Show validation errors
      alert('Please fill out all required fields correctly.');
      return;
    }

    // Use getRawValue() if you have disabled fields like dateFin and want their values submitted
    const document = this.documentForm.getRawValue();
    this.documentService.ajouterDocument(document).subscribe({ // Use object observer
      next: response => {
        console.log('Document ajouté avec succès', response);
        alert('Document added successfully!');
        this.router.navigate(['/ListDocument']);
      },
      error: error => {
        console.error('Erreur lors de l\'ajout du document', error);
        alert('Error adding document. ' + (error.error?.message || error.message));
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/ListDocument']);
  }
}
