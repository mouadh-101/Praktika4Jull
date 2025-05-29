import { Component, OnInit } from '@angular/core'; // Type was missing from original imports
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Duree, StatusDoc, Type as DocumentType } from 'src/app/Models/document'; // Renamed Type to DocumentType to avoid conflict with Component Type
import { DocumentService } from 'src/app/services/Document/Document.service';

@Component({
  selector: 'app-updateDocument',
  templateUrl: './updateDocument.component.html',
  styleUrls: ['./updateDocument.component.css']
})
export class UpdateDocumentComponent implements OnInit {
  documentForm!: FormGroup; // Definite assignment assertion
  documentId!: number;
  types = Object.values(DocumentType); // Use renamed DocumentType
  durees = Object.values(Duree);
  statusList = Object.values(StatusDoc);
  // editMode can be inferred from documentId presence, no explicit variable needed unless complex logic arises

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {} // Removed form init from constructor

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      societe: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [{ value: '', disabled: true }, Validators.required], // Keep disabled as it's calculated
      duree: ['', Validators.required],
      statusDoc: ['', Validators.required] // Status is now part of the form and editable
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.documentId = +idParam;
      if (this.documentId) {
        this.chercherDocument(this.documentId);
      } else {
        console.error('Invalid Document ID provided.');
        this.router.navigate(['/ListDocument']); // Redirect if ID is invalid
      }
    } else {
      console.error('No Document ID found in route.');
      this.router.navigate(['/ListDocument']); // Redirect if no ID
    }
  }

  onDureeChange(): void { // void return type
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
           this.documentForm.patchValue({ dateFin: '' });
        }
        return; // Exit after successful calculation
      }
    }
     this.documentForm.patchValue({ dateFin: '' }); // Clear if conditions not met
  }

  chercherDocument(id: number): void {
    this.documentService.chercherDocument(id).subscribe({ // Use object observer
      next: response => {
        // Ensure dates are in 'yyyy-MM-dd' format for the date input
        const dateDebut = response.dateDebut ? new Date(response.dateDebut).toISOString().split('T')[0] : '';
        const dateFin = response.dateFin ? new Date(response.dateFin).toISOString().split('T')[0] : '';
        
        this.documentForm.patchValue({
          societe: response.societe,
          type: response.type,
          dateDebut: dateDebut,
          dateFin: dateFin, // This will be set correctly even if control is disabled
          duree: response.duree,
          statusDoc: response.statusDoc
        });
        // Re-enable dateFin if needed, or ensure onDureeChange is called if duree/dateDebut is also patched
        // For now, if dateFin is calculated, it should remain disabled. If it's fetched, it should be displayed.
        // If it's meant to be editable independently of calculation, then remove 'disabled:true' from form init.
        // Current logic: dateFin is calculated. If a fetched value should override, it will.
      },
      error: error => {
        console.error('Erreur lors de la récupération du document', error);
        alert('Error fetching document details. ' + (error.error?.message || error.message));
        this.router.navigate(['/ListDocument']);
      }
    });
  }

  updateDocument(): void { // void return type
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      alert('Please fill out all required fields correctly.');
      return;
    }

    const document = this.documentForm.getRawValue(); // Use getRawValue to include disabled dateFin
    this.documentService.updateDocument(document, this.documentId).subscribe({ // Use object observer
      next: response => {
        console.log('Document mis à jour avec succès', response);
        alert('Document updated successfully!');
        this.router.navigate(['/ListDocument']);
      },
      error: error => {
        console.error('Erreur lors de la mise à jour du document', error);
        alert('Error updating document. ' + (error.error?.message || error.message));
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/ListDocument']);
  }
}