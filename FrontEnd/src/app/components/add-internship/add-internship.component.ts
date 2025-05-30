import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import * as bootstrap from 'bootstrap'; // For Bootstrap modal control
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-add-internship',
  templateUrl: './add-internship.component.html',
  styleUrls: ['./add-internship.component.css']
})
export class AddInternshipComponent implements OnInit {
  internshipForm!: FormGroup;
  tempDescription: string = '';
  descriptionModal: any; // Bootstrap Modal instance
  requirementModal: any; // Bootstrap Modal instance for requirements

  // Using 'any' for requirement types for now to match existing structure, consider defining interfaces later
  availableRequirements: any[] = []; 
  availableRequirementsTop5: any[] = [];
  
  newRequirementName = ''; 
  selectedRequirements: string[] = []; 
  selectedRequirementId: string | null = null; // To store name if selected from list
  filteredRequirements: any[] = [];

  // companyId: string = "5cbb93e9-80f8-47be-9e0c-0df196520a51"; // Example, should be dynamic

  constructor(
    private fb: FormBuilder,
    private internshipService: InternshipService,
    private router: Router,
    private requirementService: RequirementService
  ) {}

  ngOnInit(): void {
    this.internshipForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      location: ['', Validators.required],
      remote: [false],
      field: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', [Validators.required, this.futureDateValidator]],
      endDate: [{ value: '', disabled: true }, Validators.required], // Disabled as it's auto-calculated
      compensation: [0], // Optional, no validator
      applicationDeadline: ['', Validators.required],
      status: ['OPEN'] // Default status
      // Requirements will be handled separately and not as a FormControl here
    });

    this.setupAutoEndDateCalculation();
    this.initializeModals();

    // Fetch initial requirements based on field (if field has initial value or on field change)
    this.internshipForm.get('field')?.valueChanges.subscribe(value => {
      if (value && value.length > 1) {
        this.requirementService.getRequirementsByField(value).subscribe(data => {
          this.availableRequirements = data.map(req => ({ name: req.name, selected: false }));
          this.availableRequirementsTop5 = this.availableRequirements.slice(0, 5);
        });
      } else {
        this.availableRequirements = [];
        this.availableRequirementsTop5 = [];
      }
    });
  }

  initializeModals(): void {
    const descriptionModalElement = document.getElementById('descriptionModal');
    if (descriptionModalElement) {
      this.descriptionModal = new bootstrap.Modal(descriptionModalElement);
    }
    const requirementModalElement = document.getElementById('requirmentModal'); // Corrected ID
    if (requirementModalElement) {
      this.requirementModal = new bootstrap.Modal(requirementModalElement);
    }
  }

  futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only
    return selectedDate > today ? null : { futureDate: true };
  }

  setupAutoEndDateCalculation(): void {
    const update = () => {
      const startDateValue = this.internshipForm.get('startDate')?.value;
      const durationValue = this.internshipForm.get('duration')?.value;
      if (startDateValue && durationValue) {
        const startDate = new Date(startDateValue);
        const duration = Number(durationValue);
        if (!isNaN(startDate.getTime()) && duration > 0) {
          const endDate = new Date(startDate.setMonth(startDate.getMonth() + duration));
          this.internshipForm.get('endDate')?.setValue(endDate.toISOString().substring(0, 10));
        }
      } else {
         this.internshipForm.get('endDate')?.setValue(''); // Clear if inputs are invalid
      }
    };
    this.internshipForm.get('startDate')?.valueChanges.subscribe(update);
    this.internshipForm.get('duration')?.valueChanges.subscribe(update);
  }

  openDescriptionModal(): void {
    this.tempDescription = this.internshipForm.get('description')?.value || '';
    this.descriptionModal?.show();
  }
  closeDescriptionModal(): void {
    this.descriptionModal?.hide();
  }
  saveDescription(): void {
    this.internshipForm.patchValue({ description: this.tempDescription });
    this.closeDescriptionModal();
  }

  openAddRequirementModal(): void {
    this.newRequirementName = ''; // Reset input
    this.filteredRequirements = []; // Reset filter
    this.requirementModal?.show();
  }
  closeAddRequirementModal(): void {
    this.requirementModal?.hide();
  }

  onRequirementSearch(): void {
    if (this.newRequirementName.trim() === '') {
      this.filteredRequirements = [];
    } else {
      this.filteredRequirements = this.availableRequirements.filter(req =>
        req.name.toLowerCase().includes(this.newRequirementName.toLowerCase()) && !this.selectedRequirements.includes(req.name)
      );
    }
  }

  onRequirementSelect(requirement: { name: string }): void {
    this.newRequirementName = requirement.name; // Fill search box with selected name
    this.filteredRequirements = []; // Clear search results
  }

  saveNewRequirement(): void {
    const skillName = this.newRequirementName.trim();
    if (skillName) {
      if (!this.selectedRequirements.includes(skillName)) {
        this.selectedRequirements.push(skillName);
        // Optionally, add to availableRequirementsTop5 if not already there and space permits
        if (!this.availableRequirementsTop5.some(r => r.name === skillName) && this.availableRequirementsTop5.length < 5) {
           // To add it to suggestions, it should ideally be an object {name: string, selected: boolean}
           // For now, just adding the name. The suggestion list might need more complex handling if new items are to be added dynamically.
        }
      }
      this.newRequirementName = ''; // Reset input
      this.closeAddRequirementModal();
    } else {
      alert('Please enter or select a skill name.');
    }
  }
  
  onRequirementAdd(requirement: { name: string }): void {
    if (!this.selectedRequirements.includes(requirement.name)) {
      this.selectedRequirements.push(requirement.name);
    }
  }

  onRequirementRemove(requirementName: string): void {
    this.selectedRequirements = this.selectedRequirements.filter(req => req !== requirementName);
  }

  submitForm(): void {
    if (this.internshipForm.invalid) {
      this.internshipForm.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }
    if (this.selectedRequirements.length === 0) {
      alert('Please select or add at least one required skill.');
      return;
    }

    // const companyIdToSubmit = this.authService.getCurrentCompanyId(); // Assuming auth service provides this
    // if (!companyIdToSubmit) {
    //   alert('Company information not found. Please ensure you are logged in as a company.');
    //   return;
    // }
    // const internshipData = { ...this.internshipForm.value, companyId: companyIdToSubmit };
    // For now, using hardcoded companyId from before if service isn't ready
    const internshipData = { ...this.internshipForm.value, companyId: "5cbb93e9-80f8-47be-9e0c-0df196520a51" };


    this.internshipService.addInternshipWithRequirements(
      internshipData,
      this.selectedRequirements
    ).subscribe({
      next: response => {
        console.log('Internship posted successfully!', response);
        alert('Internship posted successfully!');
        this.router.navigate(['/internships']); // Or to company dashboard
      },
      error: error => {
        console.error('Error posting internship', error);
        alert('Failed to post internship. ' + (error.error?.message || error.message));
        // Handle server-side validation errors if provided in error.error
        if (error.error && typeof error.error === 'object') {
          Object.keys(error.error).forEach(key => {
            const formControl = this.internshipForm.get(key);
            if (formControl) {
              formControl.setErrors({ serverError: error.error[key] });
            }
          });
        }
      }
    });
  }

  goBack(): void {
    // Navigate to a relevant previous page, e.g., company dashboard or internship list
    if (this.router.url.includes('/internships/add')) { // Check if coming from a specific flow
        this.router.navigate(['/internships']); // Go to main internship list
    } else {
        window.history.back(); // Generic back
    }
  }
}
