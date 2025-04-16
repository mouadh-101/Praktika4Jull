package esprit.microservice1.controller;


import esprit.microservice1.dto.UserMoyenneResponse;
import esprit.microservice1.entity.Formation;
import esprit.microservice1.service.FormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/formations")
@CrossOrigin(origins = "*")
public class FormationController {
    @Autowired
    private FormationService formationService;

    @PostMapping
    public ResponseEntity<Formation> createFormation(@RequestBody Formation formation) {
        return new ResponseEntity<>(formationService.createFormation(formation), HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<Formation>> getAllFormations() {
        return new ResponseEntity<>(formationService.getAllFormations(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        return formationService.getFormationById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        formationService.deleteFormation(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Formation> updateFormation(@PathVariable Long id, @RequestBody Formation formation) {
        return ResponseEntity.ok(formationService.updateFormation(id, formation));
    }
    @GetMapping("/recommendations/{userId}")
    public List<Formation> getRecommendations(@PathVariable Integer userId) {
        return formationService.recommendFormationsAI(userId);
    }

    @GetMapping("/{id}/users-moyennes")
    public ResponseEntity<List<UserMoyenneResponse>> getUsersAndMoyennes(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.getUsersWithMoyenne(id));
    }
    @PostMapping("/{formationId}/assign/{userId}")
    public String assignUserToFormation(@PathVariable Long formationId, @PathVariable Integer userId) {
        return formationService.assignUserToFormation(userId, formationId);
    }
    @PostMapping("/assign/{userId}")
    public String assignUserToFormation(@RequestBody Formation formationId, @PathVariable Integer userId) {
        return formationService.assignUserToFormationrecommandation(userId, formationId);
    }
    @GetMapping("/buuser/{id}")
    public ResponseEntity<List<Formation>> getbuuser(@PathVariable Integer id) {
        return ResponseEntity.ok(formationService.getFormationsusers(id));
    }






}
