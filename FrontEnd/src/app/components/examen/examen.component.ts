import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Examen, ExamenService } from 'src/app/services/examen.service';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss'],
})
export class ExamenComponent implements OnInit {
  deleteQuestion(id: any) {
    this.examenService.deleteQuestion(id).subscribe((data) => {
      
      this.selectedExam.questions = this.selectedExam.questions.filter((question: any) => question.id !== id);
      console.log(data);
    
      console.log();
      
    },( error) => {
      console.log(error);
      
    }
    );
  }
    examens: any[] = [];
    examenForm!: FormGroup;
    isEditing: boolean = false;
    selectedExamenId?: number;
    idformation!: number;
    
  
    constructor(
      private route: ActivatedRoute,
      private examenService: ExamenService,
      private fb: FormBuilder
    ) {}
    ngOnInit(): void {
      this.idformation = Number(this.route.snapshot.paramMap.get('id'));
      this.initForm();
      this.loadExamens();
     
  
    }
    selectedUser: any = null;
    saveNote(): void {
     
    }
    initForm(): void {
      this.examenForm = this.fb.group({
        titre: ['', Validators.required],
        examenT: ['ORAL', Validators.required],
        duree: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
        session: ['PRINCIPALE', Validators.required],
        date: ['', Validators.required]
      });
    }
    goBack(){
      window.history.back()
    }
    loadExamens(): void {
      this.examenService.getExamensbyfor(this.idformation).subscribe((data) => {
        this.examens = data;
        console.log(data);
        
      });
    }
  
    selectedExam: any = null;
    voirq:boolean = false
    openQuestionsModal(exam: any) {
      this.voirq = !this.voirq
      this.selectedExam = exam;
     
    }
    
    users:any[]=[];
    copyidexamen:any
    loadparticiper(id:any): void {
      this.copyidexamen = id
      this.examenService.getParticipants(id).subscribe((data) => {
        console.log(data);
        this.users = data;
  
      });
    }
    selectedQuestionId: number = 0;
  newAnswer = {
    text: '',
    correct: false
  };
  openAddAnswerModal(question: any) {
    this.selectedQuestionId = question.id;
    this.newAnswer = { text: '', correct: false };
    
  }
  
  submitAnswer() {
    this.examenService.addAnswerToQuestion(this.selectedQuestionId, this.newAnswer).subscribe({
      next: addedAnswer => {
        alert('Réponse ajoutée avec succès !');
        console.log(addedAnswer);
        this.newAnswer.text = '';
        this.loadExamens();
        const question = this.selectedExam.questions.find((q:any) => q.id === this.selectedQuestionId);
        if (question) {
          question.answers.push(addedAnswer); // ajoute la nouvelle réponse à la liste
        }
      },
      error: err => {
        console.log(err);
        
        alert('Erreur lors de l\'ajout');
      }
    });
  }
  
    addnote(): void {
      this.examenService.addnote(this.selcetedId, this.selectedUser).subscribe((data) => {
        console.log(data);
        alert(data)
        this.loadparticiper(this.copyidexamen);
        
      },(error)=>{
        console.log(error);
        
      });
      
    }
    addExamen(): void {
      if (this.examenForm.valid) {
        this.examenService.addExamen(this.examenForm.value, this.idformation).subscribe(() => {
          this.loadExamens();
          this.examenForm.reset();
        },(error)=>{
          console.log(error);
          
        });
      }
    }
  
    editExamen(examen: Examen): void {
      this.isEditing = true;
      this.selectedExamenId = examen.id;
      this.examenForm.patchValue(examen);
    }
  
    updateExamen(): void {
      if (this.examenForm.valid && this.selectedExamenId) {
        this.examenService.updateExamen(this.selectedExamenId, this.examenForm.value).subscribe(() => {
          this.isEditing = false;
          this.selectedExamenId = undefined;
          this.loadExamens();
          this.examenForm.reset();
        });
      }
    }
    selcetedId:any
    selectid(id:any,iduser:any){
      this.selcetedId = id
    
    }
    deleteExamen(id: number): void {
      if (confirm('Voulez-vous vraiment supprimer cet examen ?')) {
        this.examenService.deleteExamen(id).subscribe(() => {
          this.loadExamens();
        });
      }
    }
    newQuestion = {
      text: ''
    };
    
    selectedExamId: number = 0;
    
    openAddQuestionModal(exam: any) {
      this.selectedExamId = exam.id!;
      this.newQuestion = { text: '' };
     
    }
    message:string=""
    submitQuestion() {
      this.examenService.addQuestionToExam(this.selectedExamId, this.newQuestion).subscribe({
        next: res => {
          this.message ='Question ajoutée avec succès !';          
          this.loadExamens();
          this.newQuestion.text = '';
        },
        error: err => {
          console.log(err);
          
          alert('Erreur lors de l\'ajout de la question');
        }
      });
    }
    
  }
  