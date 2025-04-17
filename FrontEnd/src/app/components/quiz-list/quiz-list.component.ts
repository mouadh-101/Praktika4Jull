import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  quizQuestions: any[] = [];
  selectedAnswers: number[] = []; // store the selected index per question

  ngOnInit(): void {
    const savedQuiz = localStorage.getItem('quizResponse');
    if (savedQuiz) {
      const quizData = JSON.parse(savedQuiz);
      this.quizQuestions = quizData.quiz?.questions || [];
      this.selectedAnswers = Array(this.quizQuestions.length).fill(null);
    }
  }

  selectAnswer(qIndex: number, aIndex: number): void {
    this.selectedAnswers[qIndex] = aIndex;
  }

  isCorrect(qIndex: number): boolean {
    return this.selectedAnswers[qIndex] === this.quizQuestions[qIndex].correctAnswerIndex;
  }

  isAnswered(qIndex: number): boolean {
    return this.selectedAnswers[qIndex] !== null;
  }
}
