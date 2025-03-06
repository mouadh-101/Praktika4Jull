package tn.esprit.microservicedocument.restController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.microservicedocument.entities.Depot;
import tn.esprit.microservicedocument.repository.IDepotRepository;
import tn.esprit.microservicedocument.service.IDepotService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/api/depots")
@CrossOrigin(origins = "http://localhost:4200")
public class DepotRestController {

    @Autowired
    private IDepotService depotService;

    @Autowired
    IDepotRepository depotRepository;
    @GetMapping("/upload/{idDepot}")
    public ResponseEntity<byte[]> downloadDocuments(@PathVariable Long idDepot) throws IOException {
        // Récupère le dépôt en fonction de l'ID
        Depot depot = depotRepository.findById(idDepot)
                .orElseThrow(() -> new RuntimeException("Depot not found"));

        byte[] rapport = depot.getRapport();
        byte[] journal = depot.getJournal();
        byte[] attestation = depot.getAttestation();

        // Crée un flux pour l'archive ZIP
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (ZipOutputStream zipOut = new ZipOutputStream(byteArrayOutputStream)) {
            if (rapport != null) {
                zipOut.putNextEntry(new ZipEntry("rapport.pdf"));
                zipOut.write(rapport);
                zipOut.closeEntry();
            }
            if (journal != null) {
                zipOut.putNextEntry(new ZipEntry("journal.pdf"));
                zipOut.write(journal);
                zipOut.closeEntry();
            }
            if (attestation != null) {
                zipOut.putNextEntry(new ZipEntry("attestation.pdf"));
                zipOut.write(attestation);
                zipOut.closeEntry();
            }
        }

        byte[] zipData = byteArrayOutputStream.toByteArray();

        // Configure les en-têtes HTTP pour indiquer qu'il s'agit d'un fichier ZIP
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "documents.zip");

        // Retourne la réponse avec l'archive ZIP et les en-têtes appropriés
        return new ResponseEntity<>(zipData, headers, HttpStatus.OK);
    }
    @PostMapping("/upload")
    public ResponseEntity<Depot> uploadDocuments(
            @RequestParam(value = "rapport", required = false) MultipartFile rapport,
            @RequestParam(value = "journal", required = false) MultipartFile journal,
            @RequestParam(value = "attestation", required = false) MultipartFile attestation) {
        try {
            Depot depot = depotService.addDocument(rapport, journal, attestation);
            return ResponseEntity.ok(depot);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Depot> getDepotById(@PathVariable Long id) {
        Optional<Depot> depot = depotService.findDepotById(id);
        return depot.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Depot> getAllDepots() {
        return depotService.findAllDepots();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepot(@PathVariable Long id) {
        try {
            depotService.deleteDepot(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Depot> updateDepot(
            @PathVariable Long id,
            @RequestParam(value = "rapport", required = false) MultipartFile rapport,
            @RequestParam(value = "journal", required = false) MultipartFile journal,
            @RequestParam(value = "attestation", required = false) MultipartFile attestation) {
        try {
            Depot updatedDepot = depotService.updateDepot(id, rapport, journal, attestation);
            return ResponseEntity.ok(updatedDepot);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
