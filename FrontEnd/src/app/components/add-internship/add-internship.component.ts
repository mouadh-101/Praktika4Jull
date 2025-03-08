import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import * as bootstrap from 'bootstrap'
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-add-internship',
  templateUrl: './add-internship.component.html',
  styleUrls: ['./add-internship.component.css']
})
export class AddInternshipComponent implements OnInit {
  internshipForm!: FormGroup;
  tempDescription: string = ''; // Temp variable for modal
  descriptionModal: any;
  requirementNames: string[] = []; // Array to hold requirement names
  companyId: string = "5cbb93e9-80f8-47be-9e0c-0df196520a51"; // Example companyId, this should come from a dynamic source
  availableRequirements: { name: string, selected: boolean }[] = []; 
  availableRequirementsTop5: { name: string, selected: boolean }[] = [];

  requirmentModal: any;
  showAddRequirementModal = false; // Gérer l'affichage de la modale
  newRequirementName = ''; // Stocke le nom du nouveau requirement
  selectedRequirements: string[] = []; // Stocke les requirements sélectionnés

  serverErrors: any = {};



  field: string = '';
  requirements: any[] = [];
  selectedRequirementId: string | null = null;

  filteredRequirements: { name: string, selected: boolean }[] = []; // Liste des exigences filtrées

  
  constructor(private fb: FormBuilder, private internshipService: InternshipService, private router: Router,private requirementService:RequirementService) {
    this.internshipForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      location: ['', Validators.required],
      remote: [false],
      field: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', [Validators.required, this.futureDateValidator]],
      endDate: ['', Validators.required],
      compensation: [0],
      applicationDeadline: ['', Validators.required],
      status: ['OPEN']
    });
    this.setupAutoEndDateCalculation();
  }

futureDateValidator(control: FormControl) {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate && selectedDate > today ? null : { futureDate: true };
}
// Fonction pour mettre à jour la endDate automatiquement
setupAutoEndDateCalculation() {
  this.internshipForm.get('startDate')?.valueChanges.subscribe((startDate) => {
    this.updateEndDate();
  });

  this.internshipForm.get('duration')?.valueChanges.subscribe((duration) => {
    this.updateEndDate();
  });
}

// Fonction pour calculer la nouvelle endDate et mettre à jour le formulaire
updateEndDate() {
  const startDate = this.internshipForm.get('startDate')?.value;
  const duration = this.internshipForm.get('duration')?.value;

  if (startDate && duration) {
    const start = new Date(startDate);
    // Ajouter la durée (en mois) à la date de début
    const end = new Date(start.setMonth(start.getMonth() + Number(duration)));

    // Mettre à jour le champ endDate
    this.internshipForm.get('endDate')?.setValue(end.toISOString().substring(0, 10)); // format YYYY-MM-DD
  }
}
  ngOnInit(): void {
    const modalElement = document.getElementById('descriptionModal');
    if (modalElement) {
      this.descriptionModal = new bootstrap.Modal(modalElement);
    } else {
      console.error('Modal element not found');
    }
    const modalElement1 = document.getElementById('requirmentModal');
    if (modalElement1) {
      this.requirmentModal = new bootstrap.Modal(modalElement1);
    } else {
      console.error('Modal element not found');
    }
    
    this.internshipForm.get('field')?.valueChanges.subscribe(value => {
      if (value.length > 1) {  // Si la valeur est suffisamment longue
        this.requirementService.getRequirementsByField(value).subscribe(data => {
          // Ajouter les exigences récupérées dans availableRequirements
          this.availableRequirements = data.map(requirement => ({
            name: requirement.name,  // Assurer que 'name' est le bon champ pour l'exigence
            selected: false  // Initialiser comme non sélectionnée
          }));
      this.availableRequirementsTop5 = this.availableRequirements.slice(0, 5);
        });
      }
    });
    
  }
  // Ouvre la modale pour ajouter un requirement
openAddRequirementModal() {
  this.requirmentModal.show();
}

// Fonction pour fermer la modale
closeAddRequirementModal() {
  this.requirmentModal.hide();
}

// Fonction pour sauvegarder la nouvelle exigence
// saveNewRequirement() {
//   if (this.newRequirementName.trim()) {
//     const newRequirement = { 
//       name: this.newRequirementName.trim(),
//       field: this.internshipForm.get('field')?.value // Récupérer automatiquement le field sélectionné
//       , selected: false };

//     // Vérifier si l'exigence existe déjà
//     const exists = this.availableRequirements.some(req => req.name === newRequirement.name);
//     if (!exists) {
//       // Ajouter la nouvelle exigence à la liste
//       this.availableRequirements.push(newRequirement);
//       this.newRequirementName = '';
//     }

//     // Fermer la modale après ajout
//     this.closeAddRequirementModal();
//   } else {
//     alert('Please enter a valid requirement name.');
//   }
// }


  // Fonction appelée à chaque saisie dans le champ de recherche
  onRequirementSearch() {
    // Si la saisie est vide, réinitialiser la liste filtrée
    if (this.newRequirementName.trim() === '') {
      this.filteredRequirements = [];
    } else {
      // Filtrer les exigences disponibles en fonction de la saisie
      this.filteredRequirements = this.availableRequirements.filter(req =>
        req.name.toLowerCase().includes(this.newRequirementName.toLowerCase())
      );
    }
  }

  // Fonction appelée lorsqu'une exigence est sélectionnée
  onRequirementSelect(requirement: { name: string, selected: boolean }) {
    // Ajouter l'exigence sélectionnée à la liste des exigences disponibles (Top 5)
    if (!this.availableRequirementsTop5.some(req => req.name === requirement.name)) {
      this.availableRequirementsTop5.push(requirement); // Ajoute l'exigence à Top 5
    }

    this.newRequirementName = requirement.name; // Remplir le champ avec le nom de l'exigence sélectionnée
    this.selectedRequirementId = requirement.name; // Mettre à jour l'ID de l'exigence sélectionnée
    this.filteredRequirements = []; // Réinitialiser la liste filtrée
  }

  // Fonction pour sauvegarder la nouvelle exigence
  saveNewRequirement() {
    if (this.selectedRequirementId) {
      // Si une exigence existante est sélectionnée
      const selectedRequirement = this.availableRequirements.find(req => req.name === this.selectedRequirementId);
      if (selectedRequirement) {
        selectedRequirement.selected = true; // Mettre à jour l'état de l'exigence sélectionnée
      }

      // Ajouter l'exigence sélectionnée à la liste des Top 5
      if (!this.availableRequirementsTop5.some(req => req.name === selectedRequirement?.name)) {
        this.availableRequirementsTop5.push(selectedRequirement!);
      }
    } else if (this.newRequirementName.trim()) {
      // Si l'utilisateur a entré une nouvelle exigence
      const newRequirement = { 
        name: this.newRequirementName.trim(),
        selected: false 
      };

      // Vérifier si l'exigence existe déjà
      const exists = this.availableRequirements.some(req => req.name === newRequirement.name);
      if (!exists) {
        // Ajouter la nouvelle exigence à la liste
        this.availableRequirements.push(newRequirement);
        this.availableRequirementsTop5.push(newRequirement);  // Ajouter directement dans le Top 5
        this.newRequirementName = '';  // Réinitialiser le champ de texte
      }
    } else {
      alert('Please enter a valid requirement name or select an existing one.');
    }

    // Fermer la modale après ajout
    this.closeAddRequirementModal();
  }
// saveNewRequirement() {
//   // Vérifier si une exigence a été sélectionnée ou si une nouvelle exigence est entrée
//   if (this.selectedRequirementId) {
//     // Si une exigence existante est sélectionnée
//     const selectedRequirement = this.availableRequirementsTop5.find(req => req.name === this.selectedRequirementId);
    
//     if (!selectedRequirement) {
//       // Si l'exigence n'existe pas déjà dans availableRequirementsTop5, on l'ajoute
//       const requirementToAdd = this.availableRequirements.find(req => req.name === this.selectedRequirementId);
//       if (requirementToAdd) {
//         // Ajout de l'exigence à availableRequirementsTop5
//         this.availableRequirementsTop5.push({ 
//           name: requirementToAdd.name, 
//           selected: true 
//         });
//       }
//     }
//   } else if (this.newRequirementName.trim()) {
//     // Si l'utilisateur a entré une nouvelle exigence
//     const newRequirement = { 
//       name: this.newRequirementName.trim(),
//       field: this.internshipForm.get('field')?.value, 
//       selected: false 
//     };

//     // Vérifier si l'exigence existe déjà
//     const exists = this.availableRequirementsTop5.some(req => req.name === newRequirement.name);
//     if (!exists) {
//       // Ajouter la nouvelle exigence à la liste
//       this.availableRequirementsTop5.push(newRequirement);
//       this.newRequirementName = '';  // Réinitialiser le champ de texte
//     }
//   } else {
//     alert('Please enter a valid requirement name or select an existing one.');
//   }

//   // Fermer la modale après ajout
//   this.closeAddRequirementModal();
// }



  openModal() {
    this.tempDescription = this.internshipForm.get('description')?.value || '';
    this.descriptionModal.show();
  }

  saveDescription() {
    this.internshipForm.patchValue({ description: this.tempDescription });
    this.descriptionModal.hide();
  }
  onRequirementChange(requirement: { name: string, selected: boolean }) {
    // Met à jour l'état de l'exigence sélectionnée
    requirement.selected = !requirement.selected;
  
    // Met à jour le tableau selectedRequirements
    if (requirement.selected) {
      // Ajoute l'exigence à la liste des exigences sélectionnées
      this.selectedRequirements.push(requirement.name);
    } else {
      // Supprime l'exigence de la liste des exigences sélectionnées
      const index = this.selectedRequirements.indexOf(requirement.name);
      if (index > -1) {
        this.selectedRequirements.splice(index, 1);
      }
    }
  
    // Afficher les exigences sélectionnées dans la console
    console.log('Exigences sélectionnées:', this.selectedRequirements);
  }
    // Ajouter une exigence à la liste sélectionnée
    onRequirementAdd(requirement: { name: string }) {
      // Vérifie si l'exigence est déjà sélectionnée, sinon on l'ajoute
      if (!this.selectedRequirements.includes(requirement.name)) {
        this.selectedRequirements.push(requirement.name);
      }
      console.log('Exigences sélectionnées:', this.selectedRequirements);
    }
  
    // Supprimer une exigence de la liste sélectionnée
    onRequirementRemove(requirement: string) {
      this.selectedRequirements = this.selectedRequirements.filter(req => req !== requirement);
    }

    submitForm() {
      if (this.internshipForm.valid) {
        console.log('Exigences sélectionnées lors de la soumission :', this.selectedRequirements);
    
        this.internshipService.addInternshipWithRequirements(
          this.internshipForm.value,
          this.selectedRequirements
        ).subscribe(
          response => {
            console.log('Stage ajouté avec succès !', response);
            this.router.navigate(['/internships']);
          },
          error => {
            console.error('Erreur lors de l’ajout du stage', error);
  console.log('Détails de l\'erreur:', error); // Ajoute ceci pour inspecter toute la structure de l'erreur

  // Vérifie la structure de l'erreur pour comprendre pourquoi error.error est undefined
  if (error.error) {
    console.log('Erreurs côté serveur:', error.error);
    

    if (error.error?.duration) {
      this.internshipForm.get('duration')?.setErrors({
        serverError: error.error?.duration
      });
    }


  } else {
    console.log('Pas d\'erreurs dans error.error');
  }
        
        }
        );
      } else {
        console.log('Le formulaire est invalide');
        // Optionnellement, on pourrait mettre à jour les erreurs locales d'Angular ici.
        this.internshipForm.markAllAsTouched(); // Pour marquer tous les champs comme touchés
      }
    }

   
    
    
    
}

