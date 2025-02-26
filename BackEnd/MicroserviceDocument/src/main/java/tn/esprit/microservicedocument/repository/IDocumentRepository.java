package tn.esprit.microservicedocument.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.microservicedocument.entities.Document;

public interface IDocumentRepository extends JpaRepository<Document,Long> {
}