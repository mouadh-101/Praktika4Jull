package tn.esprit.gestion_convention.services;

import tn.esprit.gestion_convention.entities.Quiz;
import tn.esprit.gestion_convention.entities.Question;
import java.util.List;

public interface IQuizService {
    // CRUD Quiz
    Quiz addQuiz(Quiz quiz);
    Quiz updateQuiz(Quiz quiz);
    Quiz retrieveQuiz(Integer quizId);
    List<Quiz> retrieveAllQuizzes();
    void removeQuiz(Integer quizId);

    // CRUD Question
    Question addQuestionToQuiz(Question question, Integer quizId);
    Question updateQuestion(Question question);
    Question retrieveQuestion(Integer questionId);
    void removeQuestion(Integer questionId);

    // Méthodes spécifiques
    List<Question> getQuestionsByQuizId(Integer quizId);
}