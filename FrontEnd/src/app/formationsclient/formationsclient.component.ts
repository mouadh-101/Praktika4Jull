import { Component, OnInit } from '@angular/core';
import { ExamenService } from '../services/examen.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormationService } from '../services/formation.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-formationsclient',
  templateUrl: './formationsclient.component.html',
  styleUrls: ['./formationsclient.component.css']
})
export class FormationsclientComponent implements OnInit {
  tests: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private examenservice:ExamenService,private auth: UserService, private router: Router,private formationService: FormationService) {}
id:any
status:boolean=false
  ngOnInit() {
    this.auth.getUser().subscribe(
      (user) => {
        console.log("User profile:", user);
       
        this.auth.getUseremail(user).subscribe(
          (data) => {
            console.log("User ID:", data);
            this.id = data.userId;
            this.getFormations()
            this.getExamens()
            this.getallFormations()
            this.getFormationsRecommandation()
          }
        )
        console.log("User ID:", this.id);
      
       
        
      },
      (error) => {
        console.error("Error fetching user profile:", error);
      }
    );
  
   
  }
  hidden:boolean = false;
  toggleHidden() {
    this.hidden = !this.hidden;
  }
  formations:any[]=[]
  examans:any[]=[]
  getExamens(): void {
    this.examenservice.getAllexsuser(this.id).subscribe((data) => {
      this.examans = data;
      console.log(data);
      
    });
  }

  getFormations(): void {
    this.formationService.getAllFormationsuser(this.id).subscribe((data) => {
      console.log(data);
      
      this.formations = data;
    });
  }
  Recommandations:any[]=[]
  getFormationsRecommandation(): void {
    this.formationService.getAllFormationrecommandation(this.id).subscribe((data) => {
      console.log(data);
      
      this.Recommandations = data;
    });
  }
  moyenne:any
  formationMoyennes: { [key: number]: number } = {}; 
  getallFormations(): void {
    this.formationService.getAllFormations().subscribe((data) => {
      this.formations = data;
  
      this.formations.forEach((formation: any) => {
        this.examenservice.getmoyenne(this.id, formation.id).subscribe((moyenne: number) => {
          this.formationMoyennes[formation.id] = moyenne;
        }, error => {
          console.error(`Erreur en récupérant la moyenne pour formation ${formation.id}`, error);
          this.formationMoyennes[formation.id] = 0;
        });
      });
  
    }, error => {
      console.error('Erreur lors de la récupération des formations', error);
    });
  }
  
  getmoyenne(idf:number):void{
    this.examenservice.getmoyenne(this.id,idf).subscribe((data:any[]) => {
      console.log(data);
      this.moyenne=data
     
    }, (error) => {
      console.error('Error fetching formations', error);
    }
    );
  }

  // getallFormations(): void {
  //   this.formationService.getAllFormations().subscribe((data) => {
  //     console.log(data);
      
  //     this.formations = data;
  //   });
  // }
  assignUser(formationId: number) {
    this.formationService.assignUserToFormation(formationId, this.id).subscribe(response => {
      alert(response);
    }, error => {
      alert("Erreur lors de l'affectation !");
    });
  }
  assignUserRecommandation(formation: any) {
    const formationSansId = { ...formation };
    delete formationSansId.id;
  
    this.formationService.assignUserToFormationrecommandation(formationSansId, this.id).subscribe(response => {
      alert(response);
    }, error => {
      alert("Erreur lors de l'affectation !");
    });
  }
  
  selected(){
    this.status=  !this.status
    if (this.status) {
      this.getallFormations()
      this.getFormationsRecommandation()
    }else{
      this.getFormationsRecommandation()
      this.getFormations()
    }

  }
 
}

