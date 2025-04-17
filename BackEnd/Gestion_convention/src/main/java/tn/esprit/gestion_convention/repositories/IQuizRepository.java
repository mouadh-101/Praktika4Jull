package tn.esprit.gestion_convention.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.gestion_convention.entities.Question;
import tn.esprit.gestion_convention.entities.Quiz;

import java.util.List;

public interface IQuizRepository extends JpaRepository<Quiz, Long> {
    // Dans IQuestionRepository.java
    @Query("SELECT q FROM Question q WHERE q.quiz.quizId = :quizId")
    List<Question> findQuestionsByQuizId(@Param("quizId") Integer quizId);
    // Dans IQuestionRepository.java

}
