package tn.esprit.gestion_convention.services;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import tn.esprit.gestion_convention.entities.Question;
import tn.esprit.gestion_convention.entities.Quiz;
import tn.esprit.gestion_convention.repositories.IQuestionRepository;
import tn.esprit.gestion_convention.repositories.IQuizRepository;

import java.util.*;

@Service
@AllArgsConstructor
public class IQuestionServiceImpl implements IQuestionService {
    private final IQuestionRepository questionRepository;
    private final IQuizRepository quizRepository;

    @Override
    public Page<Question> getAllQuestions(Pageable pageable) {
        return questionRepository.findAll(pageable);
    }

    @Override
    public Question addQuestion(Question question) {
        if (question.getQuestionText() == null || question.getQuestionText().isEmpty()) {
            throw new IllegalArgumentException("Le texte de la question ne peut pas être vide");
        }
        return questionRepository.save(question);
    }

    @Override
    public Question updateQuestion(Question question) {
        if (!questionRepository.existsById(question.getQuestionId())) {
            throw new RuntimeException("Question non trouvée avec ID: " + question.getQuestionId());
        }
        return questionRepository.save(question);
    }

    @Override
    public Question retrieveQuestion(Integer questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question non trouvée avec ID: " + questionId));
    }

    @Override
    public List<Question> retrieveAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    public void removeQuestion(Integer questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new RuntimeException("Question non trouvée avec ID: " + questionId);
        }
        questionRepository.deleteById(questionId);
    }

    @Override
    public List<Question> getQuestionsByQuizId(Integer quizId) {
        return questionRepository.findByQuizQuizId(quizId, Pageable.unpaged()).getContent();
    }

    @Override
    public List<Question> searchQuestions(String keyword) {
        return questionRepository.searchQuestions(keyword.toLowerCase(), Pageable.unpaged()).getContent();
    }

    @Override
    public boolean validateAnswer(Integer questionId, Integer answerIndex) {
        if (answerIndex == null) {
            return false;
        }
        Question question = retrieveQuestion(questionId);
        return question.getCorrectAnswerIndex() == answerIndex;
    }
    @Override
    public Question addQuestionToQuiz(Question question, Integer quizId) {
        Quiz quiz = quizRepository.findById(Long.valueOf(quizId))
                .orElseThrow(() -> new RuntimeException("Quiz non trouvé avec ID: " + quizId));
        question.setQuiz(quiz);
        return questionRepository.save(question);
    }

    @Override
    public List<Question> getRandomQuestions(Integer count) {
        long totalQuestions = questionRepository.count();
        if (count > totalQuestions) {
            count = (int) totalQuestions;
        }

        Random random = new Random();
        Set<Question> randomQuestions = new HashSet<>();

        while (randomQuestions.size() < count) {
            int randomIndex = random.nextInt((int) totalQuestions);
            Question question = questionRepository.findAll(PageRequest.of(randomIndex, 1))
                    .getContent()
                    .get(0);
            randomQuestions.add(question);
        }

        return new ArrayList<>(randomQuestions);
    }

    @Override
    public Integer calculateScore(List<Integer> questionIds, List<Integer> answers) {
        if (questionIds.size() != answers.size()) {
            throw new IllegalArgumentException("Les listes de questions et réponses doivent avoir la même taille");
        }

        int score = 0;
        for (int i = 0; i < questionIds.size(); i++) {
            if (validateAnswer(questionIds.get(i), answers.get(i))) {
                score++;
            }
        }
        return score;
    }
}