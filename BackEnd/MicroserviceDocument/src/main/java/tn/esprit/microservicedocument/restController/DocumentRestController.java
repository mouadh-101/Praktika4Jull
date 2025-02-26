package tn.esprit.microservicedocument.restController;

import com.itextpdf.text.DocumentException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservicedocument.entities.Document;
import tn.esprit.microservicedocument.repository.IDocumentRepository;
import tn.esprit.microservicedocument.service.IDocumentService;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/Document")

@AllArgsConstructor
public class DocumentRestController {
    @Autowired
    IDocumentService documentService;
    @Autowired
    IDocumentRepository documentRepository;

    @PostMapping(path = "/document")
    Document ajouterDocument(@RequestBody Document document) {
        return documentService.ajouterDocument(document) ;
    }
    @PostMapping(path = "/document/{id}")
    void supprimerDocument(@PathVariable Long id)
    {
        documentService.supprimerDocument(id);
    }
    @PutMapping(path = "/document/update")
    Document updateDocument(@RequestBody Document document)
    {
        return documentService.updateDocument(document);
    }
    @GetMapping(path = "/document/{id}")
    Document chercherDocument(@PathVariable Long id)
    {
        return documentService.chercherDodcument(id);
    }
    @PutMapping("/valider/{id}")
    public ResponseEntity<Void> validerDocument(@PathVariable Long id) {
        documentService.validerDocument(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/refuser/{id}")
    public ResponseEntity<Void> RefuserDocument(@PathVariable Long id) {
        documentService.RefuserDocument(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/DemandeStage/{id}")
    public ResponseEntity<byte[]> DemandeStage(@PathVariable("id") Long id) throws DocumentException {
        Document document = documentRepository.findById(id).orElse(null);
        if (document == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            byte[] pdfBytes = documentService.DemandeDeStage(document);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "demande_stage.pdf");
            headers.setContentLength(pdfBytes.length);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/LettreAffectation/{id}")
    public ResponseEntity<byte[]> LettreAffectation(@PathVariable("id") Long id) throws DocumentException {
        Document document = documentRepository.findById(id).orElse(null);
        if (document == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            byte[] pdfBytes = documentService.LettreAffectation(document);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "Lettre_affectation.pdf");
            headers.setContentLength(pdfBytes.length);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
