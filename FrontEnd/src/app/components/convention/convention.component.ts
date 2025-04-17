import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Convention } from "../../core/model/db";
import { Router } from "@angular/router";
import { PdfGenerationService } from "../../services/pdf-generation.service";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgSignaturePadOptions, SignaturePadComponent } from "@almothafar/angular-signature-pad";
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-convention',
  templateUrl: './convention.component.html',
  styleUrls: ['./convention.component.css']
})
export class ConventionComponent implements OnInit {
  conventions: Convention[] = [];
  conventionForm: FormGroup;
  conventionFormPython:FormGroup;
  searchForm: FormGroup;
  isEditMode = false;
  currentConventionId?: number;
  selectedConvention: Convention | null = null;
  showFormError = false;
  conId: number | undefined;
  currentPage: number = 0;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  isGeneratingPDF: number | null = null;
  // Déclaration du formulaire de mailing
  emailForm: FormGroup;
  signatureData: string | null = null;
  currentSignConventionId?: number;
  
  // Nouvelles propriétés pour les statistiques
  averageSigned: number = 0;
  averageUnsigned: number = 0;
  signedCount: number = 0;
  unsignedCount: number = 0;
  signedPercentage: number = 0;
  unsignedPercentage: number = 0;
  qrCodeImage: string | ArrayBuffer | null = '';
  chartType: ChartType = 'bar';
chartPlugins = [];
  // nouvelleConvention = { text: "Convention de stage débutant le 15 mai 2025 et se terminant le 15 août 2025 pour un stage en développement web chez Technologie Innovante SA. L'étudiant Pierre Dupont de l'Université de Paris travaillera sur la création d'applications web utilisant React et Node.js. Les termes incluent: Horaires de travail - 35 heures par semaine du lundi au vendredi; Rémunération - gratification mensuelle de 700€; Confidentialité - l'étudiant s'engage à ne pas divulguer d'informations confidentielles; Encadrement - supervision par Mme Sophie Martin, directrice technique; Évaluation - rapport de stage et présentation finale requis." };
  nouvelleConvention = {text: ""}
  showStatsModal = false;
  @ViewChild('signaturePad') signaturePad!: SignaturePadComponent;
  selectedConventionId!: number;
  qrCodeImageUrl: string | null = null;
  showQrModal: boolean = false;
  signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 2,
    canvasWidth: 400,
    canvasHeight: 200
  };

  // Configuration du graphique
  ChartType: ChartType = 'bar';
  chartData: ChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Conventions',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  };
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de Conventions'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mois'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Statistiques des Conventions par Mois'
      }
    }
  };
  
  constructor(
    private fb: FormBuilder,
    private conventionService: ConventionService,
    private router: Router,
    private pdfGenerationService: PdfGenerationService
  ) {
    this.conventionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      // internshipId: ['', [Validators.required, Validators.min(1)]],
      signed: [false, Validators.required],
      terms: this.fb.array([], [this.atLeastOneTermValidator])
    });
    this.conventionFormPython = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
    // Initialize emailForm here
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      from: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      file: ['', [Validators.required]]
    });
    this.searchForm = this.fb.group({
      keyword: [''],
      signed: [null]
    });
  }

  private atLeastOneTermValidator(control: AbstractControl): ValidationErrors | null {
    return (control as FormArray).length > 0 ? null : { noTerms: true };
  }

  ngOnInit() {

    this.getAllConventions();

    this.searchForm.get('keyword')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.performSearch());

    this.searchForm.get('signed')?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => this.performSearch());
    // Initialisation du formulaire de mailing
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      from: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      file: ['', [Validators.required]],
    });
  }

  ///codeQr
 // Méthode pour afficher le QR code
 viewQRCode(conId: number): void {
  this.conventionService.getQRCode(conId).subscribe(
    (data: Blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.qrCodeImage = reader.result;
      };
      reader.readAsDataURL(data);
    },
    error => {
      console.error('Erreur lors de la génération du QR code:', error);
    }
  );
}

/// statistique

// Filtrer les conventions par statut
filterByStatus(status: boolean | null) {
  this.searchForm.patchValue({ signed: status });
  this.performSearch();
}

// Calculer les moyennes par statut

calculateStatistics() {
  // Compter les conventions signées et non signées
  this.signedCount = this.conventions.filter(c => c.signed).length;
  this.unsignedCount = this.conventions.filter(c => !c.signed).length;
  
  // Calculer les pourcentages
  const total = this.conventions.length || 1;
  this.signedPercentage = (this.signedCount / total) * 100;
  this.unsignedPercentage = (this.unsignedCount / total) * 100;
  
  // Calculer les moyennes mensuelles (supposons 12 mois pour l'exemple)
  const months = 12;
  this.averageSigned = this.signedCount / months;
  this.averageUnsigned = this.unsignedCount / months;
  
  // Mettre à jour les données du graphique
  this.updateChartData();
}

updateChartData() {
  // Exemple de données mensuelles - à adapter avec vos vraies données
  this.chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Conventions Signées',
        data: [5, 7, 8, 6, 9, 10, 12, 8, 7, 9, 10, 11], // Remplacez par vos données réelles
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      },
      {
        label: 'Conventions Non Signées',
        data: [3, 2, 4, 5, 3, 2, 1, 4, 3, 2, 1, 2], // Remplacez par vos données réelles
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }
    ]
  };
}

handleStatsClick() {
  this.calculateStatistics();
  this.showStatsModal = true;
}

// Dans getAllConventions(), appelez calculateStatistics() après avoir reçu les données
getAllConventions() {
  this.conventionService.getAllConventions().subscribe(data => {
    this.conventions = data;
    this.calculateStatistics();
    this.updateTotalPages();
  });
}


// Mise à jour des pages pour la pagination
private updateTotalPages() {
  this.totalItems = this.conventions.length;
  this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  if (this.currentPage >= this.totalPages) {
    this.currentPage = this.totalPages - 1;
  }
  if (this.currentPage < 0) {
    this.currentPage = 0;
  }
}
  // Méthode pour soumettre le formulaire de mailing
  submitEmailForm(): void {
    if (this.emailForm.valid) {
      const to = this.emailForm.get('to')?.value;
      const from = this.emailForm.get('from')?.value;
      const subject = this.emailForm.get('subject')?.value;
      const fileInput = this.emailForm.get('file')?.value;

      if (fileInput) {
        const file = fileInput[0]; // Get the actual file from the input
        // Call the service to send the email with the extracted values
        this.conventionService.sendEmail(to, from, subject, file).subscribe({
          next: (response) => {
            console.log('Email sent successfully', response);
          },
          error: (error) => {
            console.error('Error sending email', error);
          }
        });

      }
    }
  }



  // Méthode pour ouvrir le formulaire de mailing
  openEmailForm() {
    this.router.navigate(['/email-form']);
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
          this.showFormError = false;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.showFormError = true;
        }
      });

      alert("Convention ajoutée avec succès !");
    } else {
      this.showFormError = true;
      this.markFormGroupTouched(this.conventionForm);
    }
  }

  submitFormPython() {
    if (this.conventionFormPython.valid) {
      const newConvention: Convention = this.conventionFormPython.value;
      this.nouvelleConvention.text=newConvention.description
      this.conventionService.addConventionPython(this.nouvelleConvention)
        .subscribe({
          next: (response) => {
            this.conventionService.addConvention(response.structured_data).subscribe({
              next: () => {
                this.getAllConventions();
                this.conventionFormPython.reset();
                this.showFormError = false;
              }
            });
            // éventuellement reset du champ ou affichage d’un message
          },
          error: (error) => {
            console.error('Erreur lors de l’ajout de la convention :', error);
          }
        });
      alert("Convention ajoutée avec succès !");
    } else {
      this.showFormError = true;
      this.markFormGroupTouched(this.conventionFormPython);
    }
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
      // internshipId: convention.internshipId,
      signed: convention.signed,
      dateConv: convention.dateConv
    });

    this.getTerms.clear();
    convention.terms.forEach(term => {
      this.getTerms.push(this.fb.group({
        termId: [term.termId],
        title: [term.title, Validators.required],
        description: [term.description, Validators.required]
      }));
    });
  }

  updateConvention() {
    if (!this.currentConventionId) return;

    if (this.conventionForm.valid) {
      const termsArray = this.conventionForm.value.terms || [];
      if (termsArray.length === 0) {
        this.showFormError = true;
        return;
      }

      const termsValid = termsArray.every((term: any) => term.title.trim() && term.description.trim());
      if (!termsValid) {
        this.showFormError = true;
        this.markFormGroupTouched(this.conventionForm.get('terms') as FormArray);
        return;
      }

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
      alert('Convention mise à jour avec succès !');
    } else {
      this.showFormError = true;
      this.markFormGroupTouched(this.conventionForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getConventionDetails(conId: number | undefined): void {
    if (!conId) {
      console.error('ID de convention non défini');
      return;
    }

    this.conventionService.getConventionById(conId).subscribe({
      next: (convention) => {
        this.selectedConvention = convention;
        this.router.navigate(['/conventions', conId], {
          state: { convention }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération:', err);
        this.router.navigate(['/conventions']);
      }
    });
  }

  performSearch() {
    const keyword = this.searchForm.get('keyword')?.value;
    const signed = this.searchForm.get('signed')?.value;
    this.conventionService.intelligentSearch(keyword, signed)
      .subscribe(results => this.conventions = results);
  }

  resetSearch() {
    this.searchForm.reset({
      keyword: '',
      signed: null
    });
    this.getAllConventions();
  }

  generatePdf(conId: number | undefined) {
    if (!conId) return;

    this.isGeneratingPDF = conId;

    this.pdfGenerationService.generatePdf(conId).subscribe({
      next: (data: Blob) => {
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = `convention_${conId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(downloadURL);
        this.isGeneratingPDF = null;
      },
      error: (error: any) => {
        console.error('Erreur de téléchargement', error);
        alert('Échec du téléchargement');
        this.isGeneratingPDF = null;
      }
    });
  }

  openSignatureModal(conId: number | undefined) {
    this.currentSignConventionId = conId;
    this.signatureData = null;
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  drawStart(event: MouseEvent | Touch) {
    console.log('Début du dessin');
  }

  drawComplete(event: MouseEvent | Touch) {
    this.signatureData = this.signaturePad.toDataURL();
    console.log('Signature capturée :', this.signatureData);
  }

  clearSignature() {
    this.signaturePad.clear();
    this.signatureData = null;
  }

  confirmSignature() {
    if (this.signatureData && this.currentSignConventionId) {
      console.log('Envoi de la signature :', this.signatureData);
      this.conventionService.signConvention(this.currentSignConventionId, this.signatureData).subscribe({
        next: (updatedConvention: Convention) => {
          const index = this.conventions.findIndex(c => c.conId === this.currentSignConventionId);
          if (index !== -1) {
            this.conventions[index] = updatedConvention; // Mise à jour locale
          } else {
            this.getAllConventions(); // Rafraîchissement si non trouvée
          }
          this.signatureData = null;
          this.currentSignConventionId = undefined;
          alert('Convention signée avec succès !');
          const modalElement = document.getElementById('signConventionModal');

        },
        error: (err) => {
          console.error('Erreur lors de la signature:', err);
          alert('Erreur lors de la signature');
        }
      });
    } else {
      console.log('Signature ou ID manquant :', this.signatureData, this.currentSignConventionId);
    }
  }

  cancelSignature() {
    this.signatureData = null;
    this.currentSignConventionId = undefined;
    const modalElement = document.getElementById('signConventionModal');

  }

}
