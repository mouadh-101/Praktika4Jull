package tn.esprit.gestion_convention.restcontroller;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestion_convention.entities.Question;
import tn.esprit.gestion_convention.services.IQuestionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/questions")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class QuestionController {
    private final IQuestionService questionService;

    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question createdQuestion = questionService.addQuestion(question);
        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<Question>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Question> questions = questionService.getAllQuestions(pageable);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Integer id) {
        Question question = questionService.retrieveQuestion(id);
        return ResponseEntity.ok(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Integer id,
            @RequestBody Question question) {
        question.setQuestionId(id);
        Question updatedQuestion = questionService.updateQuestion(question);
        return ResponseEntity.ok(updatedQuestion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer id) {
        questionService.removeQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<Boolean> validateAnswer(
            @PathVariable Integer id,
            @RequestParam Integer answerIndex) {
        boolean isValid = questionService.validateAnswer(id, answerIndex);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/random")
    public ResponseEntity<List<Question>> getRandomQuestions(
            @RequestParam(defaultValue = "5") Integer count) {
        List<Question> questions = questionService.getRandomQuestions(count);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/calculate-score")
    public ResponseEntity<Map<String, Object>> calculateScore(
            @RequestBody Map<String, List<Integer>> request) {
        List<Integer> questionIds = request.get("questionIds");
        List<Integer> answers = request.get("answers");

        int score = questionService.calculateScore(questionIds, answers);
        int total = questionIds.size();

        return ResponseEntity.ok(Map.of(
                "score", score,
                "total", total,
                "percentage", (score * 100) / total
        ));
    }

    @PostMapping("/{questionId}/quizzes/{quizId}")
    public ResponseEntity<Question> addQuestionToQuiz(
            @PathVariable Integer questionId,
            @PathVariable Integer quizId,
            @RequestBody Question question) {
        question.setQuestionId(questionId);
        Question result = questionService.addQuestionToQuiz(question, quizId);
        return ResponseEntity.ok(result);
    }
}