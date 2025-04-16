import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExamenService } from 'src/app/services/examen.service';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
@Component({
  selector: 'app-exman',
  templateUrl: './exman.component.html',
  styleUrls: ['./exman.component.scss']
})
export class ExmanComponent  implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    editable: true,
    events: [], 
    
    plugins: [interactionPlugin, dayGridPlugin],
    selectable: false , 
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: (info:any) => {
      const eventDate = new Date(info.event.startStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
    
      if (eventDate.getTime() !== today.getTime()) {
        info.el.style.backgroundColor = '#ccc';
        info.el.style.cursor = 'not-allowed';
      }
    },
    // dateClick: this.handleDisabledDateClick.bind(this), 
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    }
  };
  // handleDisabledDateClick(arg: any) {
  //   const clickedDate = arg.dateStr;
  //   const isExamDay = this.examens.some(e => e.date === clickedDate);
  
  //   if (isExamDay) {
  //     alert("Aucun examen prévu ce jour-là !");
  //   }
  // }
  examens: any[] = [];
  examenForm!: FormGroup;
  isEditing: boolean = false;
  selectedExamenId?: number;
  idformation!: number;
  selectedExamToDo: any = null;
  examenId:any
userAnswers: { [questionId: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private auth:UserService,
    private fb: FormBuilder
  ) {}
  userId:any
  ngOnInit(): void {
    this.idformation = Number(this.route.snapshot.paramMap.get('id'));
    this.auth.getUser().subscribe(
      (user) => {
        console.log("User profile:", user);
       
        this.auth.getUseremail(user).subscribe(
          (data) => {
            console.log("User ID:", data);
            this.userId = data.userId;
         
            this.loadExamens();
          }
        )
        console.log("User ID:", this.userId);
      
       
        
      },
      (error) => {
        console.error("Error fetching user profile:", error);
      }
    );
    this.initForm();
  }

  handleEventClick(arg: any) {
    const eventDate = new Date(arg.event.startStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
  
    if (eventDate.getTime() !== today.getTime()) {
      alert("Tu ne peux participer qu'aux examens prévus pour aujourd’hui.");
      return;
    }
 
    const examId = arg.event.id;
    const selectedExam = this.examens.find(e => e.id == examId);
    if (selectedExam) {
      this.assignUser(selectedExam.id);
      this.selectedExamToDo = selectedExam;
    }
  }
  
  
  submitExam() {
    clearInterval(this.globalInterval);

    console.log("Réponses utilisateur :", this.userAnswers);
    const payload = Object.entries(this.userAnswers).map(([questionId, answerId]) => ({
      questionId: Number(questionId),
      selectedAnswerId: Number(answerId) 
    }));
  
    const finalDto = {
      examId: this.selectedExamToDo.id,
      answers: payload
    };
  
    this.examenService.submitUserAnswers(finalDto,this.userId, this.selectedExamToDo.id).subscribe(res => {
      alert(res); 
      this.selectedExamToDo = null;
    },(error:HttpErrorResponse) => {
      alert(error.error);
       this.selectedExamToDo = null;
    });
  }
  
  assignUser(examenId: number) {
    
    this.examenService.getExamFull(examenId).subscribe(res => {
      this.selectedExamToDo = res;
      this.userAnswers = {}; 
      this.startGlobalTimer(); 
    
    }, error => {
      alert("Erreur lors de l'affectation !");
    });
  }
  initForm(): void {
    this.examenForm = this.fb.group({
      titre: ['', Validators.required],
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      examenT: ['ORAL', Validators.required],
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
      this.calendarOptions.events = this.examens.map(ex => ({
        title: ex.titre,
        date: ex.date, 
        id: ex.id
      }));
    });
  }

  globalTimer: number = 0; // en secondes
globalTimerDisplay: string = '';
globalInterval: any;


startGlobalTimer() {
  const totalQuestions = this.selectedExamToDo.questions.length;
  this.globalTimer = totalQuestions * 60; // 1 minute par question

  this.updateGlobalTimerDisplay();

  this.globalInterval = setInterval(() => {
    if (this.globalTimer > 0) {
      this.globalTimer--;
      this.updateGlobalTimerDisplay();
    } else {
      clearInterval(this.globalInterval);
      this.submitExam(); 
    }
  }, 1000);
}

updateGlobalTimerDisplay() {
  const minutes = Math.floor(this.globalTimer / 60);
  const seconds = this.globalTimer % 60;
  this.globalTimerDisplay = `${this.pad(minutes)}:${this.pad(seconds)}`;
}

pad(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}


 


}
