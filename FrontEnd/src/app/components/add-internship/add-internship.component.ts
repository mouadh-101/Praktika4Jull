import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import * as bootstrap from 'bootstrap'

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
  companyId: number = 1; // Example companyId, this should come from a dynamic source
  availableRequirements: { name: string, selected: boolean }[] = []; // Liste d'exigences avec un état sélectionné
 

  requirmentModal: any;
  showAddRequirementModal = false; // Gérer l'affichage de la modale
  newRequirementName = ''; // Stocke le nom du nouveau requirement
  selectedRequirements: string[] = []; // Stocke les requirements sélectionnés

  serverErrors: any = {};
  constructor(private fb: FormBuilder, private internshipService: InternshipService, private router: Router) {
    this.internshipForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      location: ['', Validators.required],
      remote: [false],
      field: ['', Validators.required],
      duration: [0, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      compensation: [0],
      applicationDeadline: ['', Validators.required],
      status: ['OPEN']
    });
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
    this.internshipService.getAvailableRequirements().subscribe(
      (requirements: string[]) => {
        this.availableRequirements = requirements.map(requirement => ({
          name: requirement, // Utilise directement la chaîne comme nom
          selected: false // Initialiser comme non sélectionnée
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des exigences disponibles', error);
      }
    );
    
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
saveNewRequirement() {
  if (this.newRequirementName.trim()) {
    const newRequirement = { name: this.newRequirementName.trim(), selected: false };

    // Vérifier si l'exigence existe déjà
    const exists = this.availableRequirements.some(req => req.name === newRequirement.name);
    if (!exists) {
      // Ajouter la nouvelle exigence à la liste
      this.availableRequirements.push(newRequirement);
    }

    // Fermer la modale après ajout
    this.closeAddRequirementModal();
  } else {
    alert('Please enter a valid requirement name.');
  }
}



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
          this.selectedRequirements, // Passe les exigences sélectionnées
          this.companyId
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

