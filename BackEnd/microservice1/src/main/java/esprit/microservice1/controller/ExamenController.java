package esprit.microservice1.controller;

import esprit.microservice1.entities.User;
import esprit.microservice1.entities.UserExamenDTO;
import esprit.microservice1.entity.Examen;
import esprit.microservice1.entity.ExamenParticipant;
import esprit.microservice1.entity.OurUsers;
import esprit.microservice1.service.ExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/examens")
@CrossOrigin(origins = "*")
public class ExamenController {
    @Autowired
    private ExamenService examenService;


    @GetMapping
    public ResponseEntity<List<Examen>> getAllExamens() {
        return ResponseEntity.ok(examenService.getAllExamens());
    }

    @GetMapping("byformation")
    public ResponseEntity<List<Examen>> getAllExamensfor(@RequestParam Long id) {
        return ResponseEntity.ok(examenService.getAllExamensbyFormation(id));
    }
    //  Ajouter un examen (admin, modérateur)
    @PostMapping("/{idformations}")
    public ResponseEntity<Examen> addExamen(@PathVariable Long idformations, @RequestBody Examen examen) {
        return ResponseEntity.ok(examenService.addExamen(examen,idformations));
    }
    @GetMapping("/get/{id}/{idformation}")
    public ResponseEntity<Double> getmoyenne(@PathVariable Long idformation,@PathVariable Integer id) {
        return ResponseEntity.ok(examenService.getMoyenne(idformation,id));
    }
    @PutMapping("/{id}") //id examen
    public ResponseEntity<Examen> updateExamen(@PathVariable Long id, @RequestBody Examen examen) {
        return ResponseEntity.ok(examenService.updateExamen(id, examen));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExamen(@PathVariable Long id) {
        String message = examenService.deleteExamen(id);
        return ResponseEntity.ok(message);
    }


//    @PostMapping("/{examenId}/participer/{userId}")
//    @PreAuthorize("hasRole('USER')")
//    public ResponseEntity<String> participerExamen(@PathVariable Long examenId, @PathVariable Integer userId) {
//        String message = examenService.participerExamen(examenId, userId);
//        return ResponseEntity.ok(message);
//    }
    @GetMapping("/buuser/{id}")
    public ResponseEntity<List<ExamenParticipant>> getbuuser(@PathVariable Integer id) {
        return ResponseEntity.ok(examenService.getallexamen(id));
    }
    @PostMapping("/{examenId}/assign/{userId}")
    public String assignUserToExamen(@PathVariable Long examenId, @PathVariable Integer userId) {
        return examenService.assignUserToExamen(examenId, userId);
    }
    @PostMapping("/{id}/calcul")
    public String calculerMoyenneFormation(@PathVariable Long id) {
        return examenService.calculerEtEnregistrerMoyenneParUtilisateur(id);
    }
    @PostMapping("/{examenId}/note/{userId}")
    public String addnote(@PathVariable Long examenId, @PathVariable Double userId) {
        return examenService.updateUserToExamen(examenId, userId);
    }
    @GetMapping("/{examenId}/participants")
    public ResponseEntity<List<UserExamenDTO>> getParticipantsByExamen(@PathVariable Long examenId) {
        List<UserExamenDTO> participants = examenService.getUserWithNotesByExamen(examenId);
        return ResponseEntity.ok(participants);
    }






}
