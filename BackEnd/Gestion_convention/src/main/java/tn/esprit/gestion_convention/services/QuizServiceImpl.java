package tn.esprit.gestion_convention.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import tn.esprit.gestion_convention.entities.Quiz;
import tn.esprit.gestion_convention.entities.Question;
import tn.esprit.gestion_convention.repositories.IQuestionRepository;
import tn.esprit.gestion_convention.repositories.IQuizRepository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.gestion_convention.services.IQuizService;

import java.util.List;

@Service
@AllArgsConstructor
public class QuizServiceImpl implements IQuizService {
    @Autowired
    private  IQuizRepository quizRepository;


    private final IQuestionRepository questionRepository;

    @Override
    public Quiz addQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @Override
    public Quiz updateQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @Override
    public Quiz retrieveQuiz(Integer quizId) {
        return quizRepository.findById(Long.valueOf(quizId))
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    @Override
    public List<Quiz> retrieveAllQuizzes() {
        return quizRepository.findAll();
    }


    @Override
    public void removeQuiz(Integer quizId) {
        quizRepository.deleteById(Long.valueOf(quizId));
    }

    @Override
    public Question addQuestionToQuiz(Question question, Integer quizId) {
        Quiz quiz = retrieveQuiz(quizId);
        question.setQuiz(quiz);
        return questionRepository.save(question);
    }

    @Override
    public Question updateQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    public Question retrieveQuestion(Integer questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    public void removeQuestion(Integer questionId) {
        questionRepository.deleteById(questionId);
    }
    @Override
    public List<Question> getQuestionsByQuizId(Integer quizId) {
        return questionRepository.findByQuizQuizId(quizId, Pageable.unpaged()).getContent();
    }
}