package tn.esprit.microservicedocument.service;

import com.itextpdf.text.DocumentException;
import tn.esprit.microservicedocument.entities.Document;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IDocumentService {
    Document ajouterDocument(Document document) ;
    void supprimerDocument(Long id);
    Document updateDocument(Document document);
    Document chercherDodcument(Long id);
    List<Document> afficherDocument();

    void validerDocument(Long id);

    void RefuserDocument(Long id);

    byte[] DemandeDeStage(Document documents) throws DocumentException, IOException;

    byte[] LettreAffectation(Document documents) throws DocumentException, IOException;
}
