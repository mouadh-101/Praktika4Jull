import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import * as bootstrap from 'bootstrap';
import { RequirementService } from 'src/app/services/requirement.service';
import { Internship } from 'src/app/models/internship'; // Assuming this model is comprehensive

@Component({
  selector: 'app-update-internship',
  templateUrl: './update-internship.component.html',
  styleUrls: ['./update-internship.component.css']
})
export class UpdateInternshipComponent implements OnInit {
  internshipForm!: FormGroup;
  internshipId!: number;
  internshipData: Internship | null = null; // To store fetched internship data

  tempDescription: string = '';
  descriptionModal: any;
  requirementModal: any;

  availableRequirements: any[] = [];
  availableRequirementsTop5: any[] = [];
  newRequirementName = '';
  selectedRequirements: string[] = [];
  filteredRequirements: any[] = [];
  selectedRequirementId: string | null = null; // Not strictly needed if only adding by name

  isLoading: boolean = true;
  serverErrors: any = {}; // To hold server-side validation errors

  constructor(
    private fb: FormBuilder,
    private internshipService: InternshipService,
    private requirementService: RequirementService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeModals();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.internshipId = +idParam;
      if (isNaN(this.internshipId) || this.internshipId <= 0) {
        console.error('Invalid Internship ID.');
        alert('Invalid internship ID provided.');
        this.router.navigate(['/internships']);
        return;
      }
      this.loadInternshipData();
    } else {
      console.error('No Internship ID provided.');
      alert('No internship ID found in route.');
      this.router.navigate(['/internships']);
    }

    this.internshipForm.get('field')?.valueChanges.subscribe(value => {
      if (value && value.length > 1) {
        this.requirementService.getRequirementsByField(value).subscribe(data => {
          this.availableRequirements = data.map(req => ({ name: req.name, selected: false }));
          this.updateAvailableRequirementsTop5();
        });
      } else {
        this.availableRequirements = [];
        this.availableRequirementsTop5 = [];
      }
    });
  }

  initializeForm(internship?: Internship): void {
    this.internshipForm = this.fb.group({
      titre: [internship?.titre || '', [Validators.required, Validators.minLength(3)]],
      description: [internship?.description || '', Validators.required],
      location: [internship?.location || '', Validators.required],
      remote: [internship?.remote || false],
      field: [internship?.field || '', Validators.required],
      duration: [internship?.duration || '', [Validators.required, Validators.min(1)]],
      startDate: [internship?.startDate ? new Date(internship.startDate).toISOString().split('T')[0] : '', [Validators.required, this.futureDateValidator]],
      endDate: [{ value: internship?.endDate ? new Date(internship.endDate).toISOString().split('T')[0] : '', disabled: true }, Validators.required],
      compensation: [internship?.compensation || 0],
      applicationDeadline: [internship?.applicationDeadline ? new Date(internship.applicationDeadline).toISOString().split('T')[0] : '', Validators.required],
      status: [internship?.status || 'OPEN']
    });
    this.setupAutoEndDateCalculation();

    if (internship && internship.requirements) {
      // Assuming internship.requirements is an array of strings (skill names)
      this.selectedRequirements = [...internship.requirements.map(r => typeof r === 'string' ? r : r.name)];
    } else {
      this.selectedRequirements = [];
    }
    this.tempDescription = internship?.description || '';
  }

  loadInternshipData(): void {
    this.isLoading = true;
    this.internshipService.getInternshipById(this.internshipId).subscribe({
      next: (data) => {
        this.internshipData = data;
        this.initializeForm(data); // Re-initialize form with fetched data
        this.isLoading = false;
        // Fetch requirements for the current field if field is pre-filled
        const currentField = this.internshipForm.get('field')?.value;
        if (currentField && currentField.length > 1) {
            this.requirementService.getRequirementsByField(currentField).subscribe(reqData => {
                this.availableRequirements = reqData.map(req => ({ name: req.name, selected: false }));
                this.updateAvailableRequirementsTop5();
            });
        }
      },
      error: (err) => {
        console.error('Error fetching internship data:', err);
        alert('Failed to load internship details. ' + (err.error?.message || err.message));
        this.isLoading = false;
        this.router.navigate(['/internships']);
      }
    });
  }
  
  updateAvailableRequirementsTop5(): void {
    this.availableRequirementsTop5 = this.availableRequirements
      .filter(req => !this.selectedRequirements.includes(req.name))
      .slice(0, 5);
  }

  initializeModals(): void {
    const descriptionModalElement = document.getElementById('descriptionModal');
    if (descriptionModalElement) {
      this.descriptionModal = new bootstrap.Modal(descriptionModalElement);
    }
    const requirementModalElement = document.getElementById('requirmentModal');
    if (requirementModalElement) {
      this.requirementModal = new bootstrap.Modal(requirementModalElement);
    }
  }

  futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) return null; // Don't validate if empty, required validator will catch it
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
          const endDate = new Date(startDate); // Create new Date object to avoid modifying original
          endDate.setMonth(startDate.getMonth() + duration);
          this.internshipForm.get('endDate')?.setValue(endDate.toISOString().substring(0, 10));
        }
      } else {
        this.internshipForm.get('endDate')?.setValue('');
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
    this.newRequirementName = '';
    this.filteredRequirements = [];
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
    this.newRequirementName = requirement.name;
    this.filteredRequirements = [];
  }

  saveNewRequirement(): void {
    const skillName = this.newRequirementName.trim();
    if (skillName) {
      if (!this.selectedRequirements.includes(skillName)) {
        this.selectedRequirements.push(skillName);
        this.updateAvailableRequirementsTop5(); // Refresh suggestions
      }
      this.newRequirementName = '';
      this.closeAddRequirementModal();
    } else {
      alert('Please enter or select a skill name.');
    }
  }

  onRequirementAdd(requirement: { name: string }): void {
    if (!this.selectedRequirements.includes(requirement.name)) {
      this.selectedRequirements.push(requirement.name);
      this.updateAvailableRequirementsTop5(); // Refresh suggestions
    }
  }

  onRequirementRemove(requirementName: string): void {
    this.selectedRequirements = this.selectedRequirements.filter(req => req !== requirementName);
    this.updateAvailableRequirementsTop5(); // Refresh suggestions
  }

  submitForm(): void { // Renamed from onSubmit to match AddInternshipComponent if preferred, or keep onSubmit
    if (this.internshipForm.invalid) {
      this.internshipForm.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }
    if (this.selectedRequirements.length === 0) {
      alert('Please select or add at least one required skill.');
      return;
    }

    const updatedInternshipData = { 
      ...this.internshipForm.getRawValue(), // Use getRawValue() to include disabled endDate
      id: this.internshipId 
    };

    this.internshipService.updateInternshipWithRequirements( // Assuming a similar method exists or needs to be created
      this.internshipId,
      updatedInternshipData,
      this.selectedRequirements
    ).subscribe({
      next: response => {
        console.log('Internship updated successfully!', response);
        alert('Internship updated successfully!');
        this.router.navigate(['/internships/details', this.internshipId]); // Navigate to details page
      },
      error: error => {
        console.error('Error updating internship', error);
        alert('Failed to update internship. ' + (error.error?.message || error.message));
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
    if (this.internshipId) {
      this.router.navigate(['/internships/details', this.internshipId]);
    } else {
      this.router.navigate(['/internships']);
    }
  }
}
