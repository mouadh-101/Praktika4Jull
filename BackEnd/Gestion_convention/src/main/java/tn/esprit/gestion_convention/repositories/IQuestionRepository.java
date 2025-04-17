package tn.esprit.gestion_convention.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.gestion_convention.entities.Question;

public interface IQuestionRepository extends JpaRepository<Question, Integer> {
    Page<Question> findByQuizQuizId(Integer quizId, Pageable pageable);

    @Query("SELECT q FROM Question q WHERE " +
            "LOWER(q.questionText) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(q.explanation) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Question> searchQuestions(@Param("keyword") String keyword, Pageable pageable);
}