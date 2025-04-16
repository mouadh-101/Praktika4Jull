package esprit.microservice1.controller;

import esprit.microservice1.entity.Diplome;
import esprit.microservice1.entity.OurUsers;
import esprit.microservice1.repository.DiplomeRepository;
import esprit.microservice1.repository.ExamenRepository;
import esprit.microservice1.repository.UsersRepo;
import esprit.microservice1.service.DiplomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/diplomes")
@CrossOrigin(origins = "*")
public class DiplomeController {
    @Autowired
    private DiplomeService diplomeService;
    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private ExamenRepository examenRepository;


    @Autowired
    private DiplomeRepository diplomeRepository;

    @PostMapping
    public ResponseEntity<Diplome> createDiplome(@RequestBody Diplome diplome, @RequestParam Long idformation, @RequestParam Integer iduser) {
        return new ResponseEntity<>(diplomeService.createDiplome(diplome,idformation,iduser), HttpStatus.CREATED);
    }



    @GetMapping
    public ResponseEntity<List<Diplome>> getAllDiplomes() {
        return new ResponseEntity<>(diplomeService.getAllDiplomes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diplome> getDiplomeById(@PathVariable Long id) {
        return diplomeService.getDiplomeById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiplome(@PathVariable Long id) {
        diplomeService.deleteDiplome(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Diplome> updateDiplome(@PathVariable Long id, @RequestBody Diplome diplome) {
        return ResponseEntity.ok(diplomeService.updateDiplome(id, diplome));
    }






    @GetMapping("/generate/{diplomaId}/{userId}")
    public ResponseEntity<String> generateDiploma(@PathVariable Long diplomaId, @PathVariable Integer userId) {
        Diplome diplome = diplomeRepository.findById(diplomaId)
                .orElseThrow(() -> new RuntimeException("Diplôme non trouvé"));

        try {
            String filePath = diplomeService.generateDiploma(diplome);

            System.out.println("✅ Diplôme généré avec succès : " + filePath);
            return ResponseEntity.ok("Diplôme généré avec succès : " + filePath);
        } catch (Exception e) {  // <-- Capture toutes les exceptions
            e.printStackTrace();  // <-- Affiche l'erreur exacte dans la console
            return ResponseEntity.status(500).body("Erreur lors de la génération du diplôme : " + e.getMessage());
        }
    }
    @GetMapping("/users/Image/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path path = Paths.get("diplomes/" + filename);
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(path);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}










