package tn.esprit.gestion_convention.restcontroller;


import com.itextpdf.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.repositories.IConventionRepo;
import tn.esprit.gestion_convention.services.PDFGenerationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class PDFGenerationController {

    @Autowired
    private PDFGenerationService pdfGenerationService;

    @Autowired
    private IConventionRepo conventionRepository;

    @GetMapping("/generate-pdf/{conId}") // Changé de PostMapping à GetMapping
    public ResponseEntity<byte[]> generatePDF(@PathVariable Integer conId) throws DocumentException, IOException {
        // Le reste du code reste identique
        Convention convention = conventionRepository.findById(conId)
                .orElseThrow(() -> new IllegalArgumentException("Convention introuvable avec l'ID " + conId));

        byte[] pdfBytes = pdfGenerationService.generatePDF(convention);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=convention_" + conId + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

}