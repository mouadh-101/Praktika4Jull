package tn.esprit.microservicedocument.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.microservicedocument.entities.Document;
import tn.esprit.microservicedocument.entities.Duree;
import tn.esprit.microservicedocument.entities.StatusDoc;

import java.util.List;

public interface IDocumentRepository extends JpaRepository<Document,Long> {
    List<Document> findDocumentsByDuree(Duree Duree);
    List<Document> findDocumentsByStatusDoc(StatusDoc StatusDoc);

}