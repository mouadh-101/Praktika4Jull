package esprit.microserviceinterview.repositories;

import esprit.microserviceinterview.entities.DemandeInterview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemandeInterviewRepo  extends JpaRepository<DemandeInterview, Long> {
}
