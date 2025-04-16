package esprit.microservice1.controller;


import esprit.microservice1.dto.SubmitExamDTO;
import esprit.microservice1.dto.UserAnswerDTO;
import esprit.microservice1.entities.User;
import esprit.microservice1.entity.*;
import esprit.microservice1.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

@RestController
@RequestMapping("/api/chatbot/answers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnswerExController {

    private final AnswerRepository answerRepo;
    private final QuestionExRepository questionRepo;
    private final ExamenParticipantRepository examenParticipationRepo;
    @PostMapping("/{questionId}")
    public ResponseEntity<AnswerEx> addAnswerToQuestion(
            @PathVariable Long questionId, @RequestBody AnswerEx answer) {
        QuestionEx question = questionRepo.findById(questionId).orElseThrow();
        answer.setQuestion(question);
        return ResponseEntity.ok(answerRepo.save(answer));
    }
    @Autowired
    private WebClient webClient;
    private final ExamenRepository examRepo;

@PostMapping("/submit")
public ResponseEntity<?> submitExam(@RequestBody SubmitExamDTO dto, @RequestParam  Integer userId, @RequestParam Long ExamenId) {
    Examen exam = examRepo.findById(dto.getExamId()).orElseThrow();
    Optional<ExamenParticipant> existingParticipation = examenParticipationRepo.findByUserIdAndExamen(userId, exam);
    if (existingParticipation.isPresent()) {
        return ResponseEntity.badRequest().body("Vous avez déjà participé à cet examen.");
    }
    int correctCount = 0;
    for (UserAnswerDTO ua : dto.getAnswers()) {
        AnswerEx answer = answerRepo.findById(ua.getSelectedAnswerId()).orElseThrow();
        if (answer.isCorrect()) {
            correctCount++;
        }
    }
    double score = correctCount;
    User user = webClient.get()
            .uri(uriBuilder -> uriBuilder
                    .path("/api/users/userById")
                    .build())
            .header("userId", userId.toString())
            .retrieve()
            .bodyToMono(User.class)
            .block();
    Examen examen= examRepo.findById(ExamenId).get();
   ExamenParticipant participant =    new ExamenParticipant();
   participant.setUserId(user.getUserId());
   participant.setExamen(examen);
    participant.setNote(score);
    participant.setMoyenne(0.0);
    examenParticipationRepo.save(participant);
    return ResponseEntity.ok(score);
}


}
