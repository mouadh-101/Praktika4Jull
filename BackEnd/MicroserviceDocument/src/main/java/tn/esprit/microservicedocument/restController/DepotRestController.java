package tn.esprit.microservicedocument.restController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.microservicedocument.entities.Depot;
import tn.esprit.microservicedocument.service.IDepotService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/depots")
public class DepotRestController {

    @Autowired
    private IDepotService depotService;

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
