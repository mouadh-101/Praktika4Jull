package tn.esprit.microservicedocument.restController;

import com.google.zxing.EncodeHintType;
import com.itextpdf.text.DocumentException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservicedocument.entities.Depot;
import tn.esprit.microservicedocument.entities.Document;
import tn.esprit.microservicedocument.entities.Duree;
import tn.esprit.microservicedocument.entities.StatusDoc;
import tn.esprit.microservicedocument.repository.IDocumentRepository;
import tn.esprit.microservicedocument.service.IDocumentService;

import java.io.IOException;
import java.util.*;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/Document")
@CrossOrigin(origins = "http://localhost:4200")

@AllArgsConstructor
public class DocumentRestController {
    @Autowired
    IDocumentService documentService;
    @Autowired
    IDocumentRepository documentRepository;

    @GetMapping("/generateQRCode/{id}")
    public ResponseEntity<String> generateQRCode(@PathVariable("id") Long id) throws IOException {
        // Lien pour chaque fichier à télécharger
        String downloadLinks = "http://localhost:8088/api/Document/DemandeStage/" + id + "\n"
                + "http://localhost:8088/api/Document/LettreAffectation/" + id + "\n"
                + "http://localhost:8088/api/Document/AutreFichier/" + id;

        // Générer le QR code à partir des liens
        try {
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.MARGIN, 1);  // Optionnel, pour ajuster la marge du QR code

            // Créer un BitMatrix à partir des liens
            BitMatrix matrix = new MultiFormatWriter().encode(downloadLinks, BarcodeFormat.QR_CODE, 300, 300, hints);

            // Créer une image à partir du QR code
            BufferedImage image = new BufferedImage(300, 300, BufferedImage.TYPE_INT_RGB);
            image.createGraphics();

            // Dessiner le QR code dans l'image
            Graphics2D graphics = (Graphics2D) image.getGraphics();
            graphics.setColor(Color.WHITE);
            graphics.fillRect(0, 0, 300, 300);
            graphics.setColor(Color.BLACK);

            for (int i = 0; i < 300; i++) {
                for (int j = 0; j < 300; j++) {
                    if (matrix.get(i, j)) {
                        image.setRGB(i, j, Color.BLACK.getRGB());
                    } else {
                        image.setRGB(i, j, Color.WHITE.getRGB());
                    }
                }
            }

            // Convertir l'image en base64
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", baos);
            byte[] imageInByte = baos.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageInByte);

            // Retourner le base64 dans la réponse
            return ResponseEntity.ok(base64Image);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public List<Document> getAllDepots() {
        return documentService.afficherDocument();
    }

    @PostMapping(path = "/document")
    Document ajouterDocument(@RequestBody Document document) {
        return documentService.ajouterDocument(document) ;
    }
    @DeleteMapping(path = "/document/{id}")
    void supprimerDocument(@PathVariable Long id)
    {
        documentService.supprimerDocument(id);
    }
    //@PutMapping(path = "/document/update")
    //Document updateDocument(@RequestBody Document document)
    //{
      //  return documentService.updateDocument(document);
    //
    //}
    @PutMapping("/update/{id}")
    public ResponseEntity<Document> updateDocument(@PathVariable("id") Long id, @RequestBody Document document) {
        Optional<Document> existingDocument = documentRepository.findById(id);
        if (!existingDocument.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Mise à jour du document
        document.setDocid(id);
        Document updatedDocument = documentRepository.save(document);

        return ResponseEntity.ok(updatedDocument);
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
    @GetMapping("/filter")
    public List<Document> getDocumentByDuree(@RequestParam Duree Duree) {
        return documentService.getDocumentByDuree(Duree);
    }
    @GetMapping("/filterStatus")
    public List<Document> getDocumentByStatusDoc(@RequestParam StatusDoc StatusDoc) {
        return documentService.getDocumentByStatusDoc(StatusDoc);
    }
}
