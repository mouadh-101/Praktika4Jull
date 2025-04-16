import { Component, OnInit } from '@angular/core';
import { Diplome, DiplomeService } from 'src/app/services/diplome.service';
import { Formation, FormationService } from 'src/app/services/formation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-diplome',
  templateUrl: './diplome.component.html',
  styleUrls: ['./diplome.component.scss']
})
export class DiplomeComponent implements OnInit {
  diplomes: any[] = [];
  users: any[] = [];
  formations: Formation[] = [];
  selectedDiplome: any = {  dateObtention: '', formation: {}, user: {} };
  isEditMode = false;
  constructor(private diplomeService: DiplomeService,
    private serviceUser: UserService,
    private formationservice:FormationService) {}

  ngOnInit(): void {
    this.loadDiplomes();
    this.loadUsers();
    this.loadFormations();
  }

  loadDiplomes(): void {
    this.diplomeService.getAllDiplomes().subscribe(
      (data) =>{ this.diplomes = data
        console.log(data);
      },
      (error) => console.error('Error fetching diplomas', error)
    );
  }

  loadUsers(): void {
    this.serviceUser.getUsers().subscribe(
      (data) => {
        this.users = data

        console.log(data);
        
      },
      (error) => console.error('Error fetching users', error)
    );
  }

  loadFormations(): void {
    this.formationservice.getAllFormations().subscribe(
      (data) => {this.formations = data

        console.log(data);
        
      },
      (error) => console.error('Error fetching formations', error)
    );
  }

  onCreateDiplome(): void {
    console.log(this.selectedDiplome);
    const date ={
      dateObtention:this.selectedDiplome.dateObtention
    }
    const idfor=this.selectedDiplome.formation
    const iduser  = this.selectedDiplome.user
    console.log(date);
    
    this.diplomeService.createDiplome(date,idfor,iduser).subscribe(
      (data) => {
        this.diplomes.push(data);
        this.resetForm();
      },
      (error) => console.error('Error creating diploma', error)
    );
  }

  onEditDiplome(id: number): void {
    this.diplomeService.getDiplomeById(id).subscribe(
      (data) => {
        console.log(data);
        
        this.selectedDiplome = data;
        this.isEditMode = true;
      },
      (error) => console.error('Error fetching diploma', error)
    );
  }
  goBack(){
    window.history.back()
  }
  onGenerateDiploma(diplomaId: number, userId: number): void {
    this.diplomeService.generateDiploma(diplomaId, userId).subscribe(
      (response: string) => {
        // window.open(response, '_blank');
        alert('Diploma generated successfully! ');
        this.loadDiplomes()
      },
      (error) => {
        console.error('Error generating diploma', error);
      }
    );
  }
  onUpdateDiplome(): void {
    this.diplomeService.updateDiplome(this.selectedDiplome.id, this.selectedDiplome).subscribe(
      (data) => {
        const index = this.diplomes.findIndex(d => d.id === data.id);
        if (index !== -1) this.diplomes[index] = data;
        this.resetForm();
      },
      (error) => console.error('Error updating diploma', error)
    );
  }

  onDeleteDiplome(id: number): void {
    this.diplomeService.deleteDiplome(id).subscribe(
      () => this.diplomes = this.diplomes.filter(d => d.id !== id),
      (error) => console.error('Error deleting diploma', error)
    );
  }

  resetForm(): void {
    this.selectedDiplome = { dateObtention: '', formation: {}, user: {} };
    this.isEditMode = false;
  }
}