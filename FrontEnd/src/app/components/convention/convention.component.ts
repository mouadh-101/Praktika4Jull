import { Component, OnInit } from '@angular/core';
import { ConventionService } from '../../services/convention.service';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Convention} from "../../core/model/db";
import {Router} from "@angular/router";
import {PdfGenerationService} from "../../services/pdf-generation.service";

@Component({
  selector: 'app-convention',
  templateUrl: './convention.component.html',
  styleUrls: ['./convention.component.css']
})
export class ConventionComponent implements OnInit {
  conventions: Convention[] = [];
  conventionForm: FormGroup;
  isEditMode = false;
  currentConventionId?: number;
  selectedConvention: Convention | null = null; // Nouvelle variable pour stocker la convention sélectionnée
  // Ajouter cette propriété
  showFormError = false;
  conId: number | undefined;  // This will store the convention ID
// Variables de composant
// Ajouter ces variables
  searchKeyword: string = '';
  searchSigned: boolean | null = null;


  constructor(private fb: FormBuilder, private conventionService: ConventionService, private router: Router,private pdfService: PdfGenerationService) {
    this.conventionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      internshipId: ['', [Validators.required, Validators.min(1)]],
      signed: [false, Validators.required],
      terms: this.fb.array([], [this.atLeastOneTermValidator]) // Validateur personnalisé
    });
  }


  // Méthode de filtrage
  // Méthode modifiée



  // Ajouter ce validateur personnalisé
  private atLeastOneTermValidator(control: AbstractControl): ValidationErrors | null {
    return (control as FormArray).length > 0 ? null : { noTerms: true };
  }
  ngOnInit() {
    this.getAllConventions();
  }

  get getTerms(): FormArray {
    return this.conventionForm.get('terms') as FormArray;
  }

  addTerm() {
    this.getTerms.push(this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]

    }));
  }

  removeTerm(index: number) {
    this.getTerms.removeAt(index);
  }

  submitForm() {
    if (this.conventionForm.valid) {
      const newConvention: Convention = this.conventionForm.value;
      this.conventionService.addConvention(newConvention).subscribe({
        next: () => {
          this.getAllConventions();
          this.conventionForm.reset();
          this.showFormError = false; // Réinitialiser l'erreur
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.showFormError = true;
        }
      });
      alert("Convention ajoutée avec succès !");
    } else {
      this.showFormError = true; // Afficher l'erreur
      this.markFormGroupTouched(this.conventionForm);
    }
  }


  getAllConventions() {
    this.conventionService.getAllConventions().subscribe(data => {
      this.conventions = data;
    });
  }

  deleteConvention(conventionId: number | undefined) {
    if (conventionId !== undefined && confirm('Êtes-vous sûr de vouloir supprimer cette convention ?')) {
      this.conventionService.deleteConvention(conventionId).subscribe(() => {
        this.getAllConventions();
      }, error => console.error('Erreur:', error));
    }
  }

  loadConventionData(convention: Convention) {
    this.isEditMode = true;
    this.currentConventionId = convention.conId;

    this.conventionForm.patchValue({
      description: convention.description,
      internshipId: convention.internshipId,
      signed: convention.signed,
      dateConv: convention.dateConv // Ajouter ce champ si nécessaire
    });

    this.getTerms.clear();
    convention.terms.forEach(term => {
      this.getTerms.push(this.fb.group({
        termId: [term.termId], // Conserver l'ID existant
        title: [term.title, Validators.required],
        description: [term.description, Validators.required]
      }));
    });
  }
  // Ajout de la méthode getById

  updateConvention() {
    if (!this.currentConventionId) return;

    if (this.conventionForm.valid) {
      // Vérifier si au moins un terme est ajouté
      const termsArray = this.conventionForm.value.terms || [];
      if (termsArray.length === 0) {
        this.showFormError = true;  // Affiche un message d'erreur si aucun terme n'est présent
        return;
      }

      // Vérifier si tous les termes sont valides (aucun champ vide)
      const termsValid = termsArray.every((term: any) => term.title.trim() && term.description.trim());
      if (!termsValid) {
        this.showFormError = true;
        this.markFormGroupTouched(this.conventionForm.get('terms') as FormArray);
        return;
      }

      // Construire l'objet mis à jour en filtrant les termes valides
      const updatedConvention: Convention = {
        ...this.conventionForm.value,
        conId: this.currentConventionId,
        terms: termsArray.map((term: any) => ({
          termId: term.termId || null,
          title: term.title.trim(),
          description: term.description.trim()
        }))
      };

      this.conventionService.updateConvention(this.currentConventionId, updatedConvention)
        .subscribe({
          next: () => {
            this.getAllConventions();
            this.conventionForm.reset();
            this.isEditMode = false;
            this.showFormError = false;
          },
          error: (err) => {
            console.error('Erreur:', err);
            this.showFormError = true;
          }
        });
      alert('convention mis à jour avec succès !');
    } else {
      this.showFormError = true;
      this.markFormGroupTouched(this.conventionForm);
    }
  }

  // Ajouter cette méthode pour marquer tous les champs comme touchés
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
  // Ajouter cette méthode
  getConventionDetails(conId: number | undefined): void {
    if (!conId) {
      console.error('ID de convention non défini');
      return;
    }

    this.conventionService.getConventionById(conId).subscribe({
      next: (convention) => {
        this.selectedConvention = convention;
        this.router.navigate(['/conventions', conId], {
          state: { convention } // Transférer les données via l'état de navigation
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération:', err);
        this.router.navigate(['/conventions']); // Rediriger en cas d'erreur
      }
    });
  }
  generatePDF(conId: number | undefined) {
    if (!conId) return;

    this.pdfService.generatePdf(conId).subscribe((data: Blob) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `convention_${conId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(downloadURL);
    });
  }


// Méthode de recherche
  performSearch() {
    this.conventionService.intelligentSearch(this.searchKeyword, this.searchSigned)
      .subscribe(results => {
        this.conventions = results;
      });
  }

// Réinitialiser la recherche
  resetSearch() {
    this.searchKeyword = '';
    this.searchSigned = null;
    this.getAllConventions();
  }

}
