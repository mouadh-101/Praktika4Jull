package esprit.microservice1.controller;


import esprit.microservice1.entity.Examen;
import esprit.microservice1.entity.QuestionEx;
import esprit.microservice1.repository.ExamenRepository;
import esprit.microservice1.repository.QuestionExRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionExController {

    private final QuestionExRepository questionRepo;
    private final ExamenRepository examRepo;

    @PostMapping("/{examId}")
    public ResponseEntity<QuestionEx> addQuestionToExam(
            @PathVariable Long examId, @RequestBody QuestionEx question) {
        Examen exam = examRepo.findById(examId).orElseThrow();
        question.setExam(exam);
        return ResponseEntity.ok(questionRepo.save(question));
    }
    @GetMapping("/{id}/full")
    public ResponseEntity<Examen> getExamWithQuestionsAndAnswers(@PathVariable Long id) {
        Examen exam = examRepo.findById(id).orElseThrow();
        exam.getQuestions().forEach(q -> q.getAnswers().size());
        return ResponseEntity.ok(exam);
    }

    @DeleteMapping("/delete/{examId}")
    public  String delete(
            @PathVariable Long examId) {
        questionRepo.deleteById(examId);
return "deleted";
    }

}
