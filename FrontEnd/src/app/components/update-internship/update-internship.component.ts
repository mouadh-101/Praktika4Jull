import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Internship } from 'src/app/models/internship';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-update-internship',
  templateUrl: './update-internship.component.html',
  styleUrls: ['./update-internship.component.css']
})
export class UpdateInternshipComponent {
  internshipForm!: FormGroup;
  internshipId!: number;
  internship: Internship = {
    id: 0,
    titre: '',
    description: '',
    location: '',
    remote: false,
    field: '',
    duration: 0,
    startDate: '', 
    endDate: '',  
     compensation: 0,
    applicationDeadline: '', 
      status: 'OPEN',
    requirements: [],
    company: undefined };
  constructor(
    private route: ActivatedRoute,
    private internshipService: InternshipService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.internshipService.getInternshipById(+id).subscribe((data) => {
        this.internship = data;
      });
    }
  }

  onSubmit(): void {
    this.internshipService.updateInternship(this.internship.id, this.internship).subscribe({
      next: (response) => {
        this.router.navigate(['/internships']); // Rediriger vers la liste des stages après la mise à jour
      },
      error: (error) => {
        console.error('Error updating internship:', error);
      }
    });
  }
}
