package tn.esprit.gestion_convention.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.esprit.gestion_convention.entities.Question;

import java.util.List;

public interface IQuestionService {
    // CRUD de base
    Question addQuestion(Question question);
    Question updateQuestion(Question question);
    Question retrieveQuestion(Integer questionId);
    List<Question> retrieveAllQuestions();
    void removeQuestion(Integer questionId);

    // Fonctionnalités avancées
    List<Question> getQuestionsByQuizId(Integer quizId);
    List<Question> searchQuestions(String keyword);
    boolean validateAnswer(Integer questionId, Integer answerIndex);
    Question addQuestionToQuiz(Question question, Integer quizId);
    List<Question> getRandomQuestions(Integer count);
    Integer calculateScore(List<Integer> questionIds, List<Integer> answers);

    Page<Question> getAllQuestions(Pageable pageable);
}
