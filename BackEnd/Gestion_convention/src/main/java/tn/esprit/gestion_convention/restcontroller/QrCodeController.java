package tn.esprit.gestion_convention.restcontroller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.repositories.IConventionRepo;
import tn.esprit.gestion_convention.services.IConventionService;

@RestController
@RequestMapping("/api/convention")
@RequiredArgsConstructor
@CrossOrigin("*")
public class QrCodeController {

    private final IConventionRepo conventionRepo;
    private final IConventionService conventionService;

    @GetMapping(value = "/generateQR/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQRCode(@PathVariable("id") Integer conId) throws Exception {
        Convention convention = conventionRepo.findById(conId)
                .orElseThrow(() -> new RuntimeException("Convention not found"));

        byte[] image = conventionService.generateQRCode(convention);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
    }
}
