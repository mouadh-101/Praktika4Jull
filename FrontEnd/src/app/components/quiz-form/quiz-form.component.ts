import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, Quiz } from 'src/app/core/model/db';


@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.css']
})
export class QuizFormComponent implements OnInit {
  quizForm: FormGroup;
  isEditMode = false;
  quizId: number | null = null;
  availableQuestions: Question[] = [];
  selectedQuestions: Question[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  nouvelleQuiz= {topic:"",num_questions:0}
  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: ['draft', Validators.required],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAvailableQuestions();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.quizId = +params['id'];
        this.loadQuiz(this.quizId);
      }
    });
  }

  get questionsFormArray(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  loadAvailableQuestions(): void {
    this.isLoading = true;
    this.quizService.getAllQuestions().subscribe({
      next: (questions) => {
        this.availableQuestions = questions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading questions', error);
        this.errorMessage = 'Impossible de charger les questions';
        this.isLoading = false;
      }
    });
  }

  loadQuiz(id: number): void {
    this.isLoading = true;
    this.quizService.getQuizById(id).subscribe({
      next: (quiz) => {
        this.quizForm.patchValue({
          title: quiz.title,
          status: quiz.status
        });
        this.selectedQuestions = quiz.questions || [];
        this.updateQuestionsFormArray();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading quiz', error);
        this.errorMessage = 'Impossible de charger le quiz';
        this.isLoading = false;
      }
    });
  }

  updateQuestionsFormArray(): void {
    this.questionsFormArray.clear();
    this.selectedQuestions.forEach(question => {
      this.questionsFormArray.push(this.fb.control(question.questionId));
    });
  }

  onQuestionSelect(event: Event, questionId: number): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const question = this.availableQuestions.find(q => q.questionId === questionId);
    
    if (!question) return;

    if (isChecked) {
      this.selectedQuestions.push(question);
    } else {
      this.selectedQuestions = this.selectedQuestions.filter(q => q.questionId !== questionId);
    }
    this.updateQuestionsFormArray();
  }

  isQuestionSelected(questionId: number): boolean {
    return this.selectedQuestions.some(q => q.questionId === questionId);
  }

  onSubmit(): void {
    this.nouvelleQuiz.num_questions = parseInt(this.quizForm.value.status)
    this.nouvelleQuiz.topic = this.quizForm.value.title
    this.quizService.addQuizPython(this.nouvelleQuiz)
    .subscribe({
      next: (response) => {
        localStorage.setItem('quizResponse', JSON.stringify(response));
        this.router.navigate(['/quizzes']); // 👉 Redirection ici après succès
      },
      error: (error) => {
        console.error('Erreur lors de l’ajout de la convention :', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/quizzes']);
  }
}