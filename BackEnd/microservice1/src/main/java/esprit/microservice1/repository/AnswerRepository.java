package esprit.microservice1.repository;

import esprit.microservice1.entity.AnswerEx;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<AnswerEx, Long> {}
