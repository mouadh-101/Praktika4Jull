package esprit.microserviceinterview.repositories;

import esprit.microserviceinterview.entities.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepo  extends JpaRepository<Interview, Long> {


}
