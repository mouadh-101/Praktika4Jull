package esprit.microservice1.repositories;

import esprit.microservice1.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidatRepo extends JpaRepository<Comment, Long> {
}
