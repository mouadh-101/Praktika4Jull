package tn.esprit.gestion_convention.restcontroller;

import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import tn.esprit.gestion_convention.entities.Quiz;
import tn.esprit.gestion_convention.entities.Question;
import tn.esprit.gestion_convention.repositories.IQuestionRepository;
import tn.esprit.gestion_convention.services.IQuizService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class QuizController {

    private final IQuizService quizService;

    @PostMapping
    public Quiz addQuiz(@RequestBody Quiz quiz) {
        return quizService.addQuiz(quiz);
    }

    @PutMapping
    public Quiz updateQuiz(@RequestBody Quiz quiz) {
        return quizService.updateQuiz(quiz);
    }


    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Integer id) {
        return quizService.retrieveQuiz(id);
    }

    // Dans votre entité Quiz
    @OneToMany(mappedBy = "quiz", fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>(); // Initialisation par défaut
    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizService.retrieveAllQuizzes();
    }

    @DeleteMapping("/{quizId}")
    public void deleteQuiz(@PathVariable Integer quizId) {
        quizService.removeQuiz(quizId);
    }

    @PostMapping("/{quizId}/questions")
    public Question addQuestionToQuiz(@RequestBody Question question,
                                      @PathVariable Integer quizId) {
        return quizService.addQuestionToQuiz(question, quizId);
    }

    @GetMapping("/{quizId}/questions")
    public List<Question> getQuizQuestions(@PathVariable Integer quizId) {
        return quizService.getQuestionsByQuizId(quizId);
    }
}