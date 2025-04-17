package tn.esprit.microservicedocument.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.microservicedocument.entities.Document;
import tn.esprit.microservicedocument.entities.Journal;

public interface IJournalRepository extends JpaRepository<Journal,Long> {
}
