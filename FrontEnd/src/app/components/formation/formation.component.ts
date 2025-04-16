import { Component, OnInit } from '@angular/core';
import { ExamenService } from 'src/app/services/examen.service';
import { Formation, FormationService } from 'src/app/services/formation.service';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss'],
})
export class FormationComponent implements OnInit {
  formations: Formation[] = [];
  newFormation: Formation = new Formation();
  selectedFormation: Formation | null = null;

  constructor(private formationService: FormationService,
    private examen: ExamenService,
  ) {}

  ngOnInit(): void {
    this.getFormations();
  }

  getFormations(): void {
    this.formationService.getAllFormations().subscribe((data) => {
      console.log(data);
      
      this.formations = data;
    });
  }
  calculmoyenne(id:number):void{
    this.examen.calcul(id).subscribe((data) => {
      console.log(data);
      alert("la moyenne est : "+data)
    }, (error) => {
      console.error('Error fetching formations', error);
    }
    );
  }
  addFormation(): void {
    this.formationService.createFormation(this.newFormation).subscribe(() => {
      this.getFormations();
      this.openadd=false
      this.newFormation = new Formation();
    });
  }

  editFormation(formation: Formation): void {
    this.selectedFormation = { ...formation };
  }

  updateFormation(): void {
    if (this.selectedFormation) {
      this.formationService
        .updateFormation(this.selectedFormation.id, this.selectedFormation)
        .subscribe(() => {
          this.getFormations();
          this.selectedFormation = null;
        });
    }
  }

  deleteFormation(id: number): void {
    this.formationService.deleteFormation(id).subscribe(() => {
      this.getFormations();
    });
  }

  cancelEdit(): void {
    this.selectedFormation = null;
  }
  userMoyennes: any[] = [];
  getusersmoy(id: any) {
  this.formationService.getmoyenneusers(id).subscribe((data) => {
    console.log(data);
    this.userMoyennes=data
    this.examen.calcul(id).subscribe((data) => {
      console.log(data);
     
    }, (error) => {
      console.error('Error fetching formations', error);
    }
    );
  })
  }
  selectedFormationId:any
  showCourses:boolean = false;
  openadd:boolean=false
  cancelajouter(): void {
    this.openadd = !this.openadd;
  }
}
