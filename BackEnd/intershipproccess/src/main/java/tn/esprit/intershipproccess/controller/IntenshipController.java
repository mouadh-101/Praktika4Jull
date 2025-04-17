package tn.esprit.intershipproccess.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.intershipproccess.entity.Company;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.entity.InternshipRequest;
import tn.esprit.intershipproccess.entity.Requirement;
import tn.esprit.intershipproccess.service.InternshipService;
import tn.esprit.intershipproccess.service.MatchmakingService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class IntenshipController {
    @Autowired
    private InternshipService internshipService;
    @Autowired
    private MatchmakingService matchmakingService;

    // Endpoint pour récupérer les stages avec les filtres
    @GetMapping
    public List<Internship> getInternships(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer duration,
            @RequestParam(required = false) BigDecimal compensation,
            @RequestParam(required = false) String field,
            @RequestParam(required = false) Boolean remote) {

        return internshipService.getInternshipsWithFilters(location, duration, compensation, field, remote);
    }

    @PostMapping("/addIntership")
    public ResponseEntity<?> addInternship(@RequestBody Internship internship){
        Internship savedInternship = internshipService.addInternship(internship);
        return new ResponseEntity<>(savedInternship, HttpStatus.CREATED);
    }
    @PostMapping("/addIntership1")
    public ResponseEntity<?> addInternshipWithRequirements(
            @RequestBody @Valid InternshipRequest internshipRequest,
            @RequestHeader("userId") String companyId){
        Internship internship = new Internship();
        internship.setTitre(internshipRequest.getTitre());
        internship.setDescription(internshipRequest.getDescription());
        internship.setLocation(internshipRequest.getLocation());
        internship.setRemote(internshipRequest.isRemote());
        internship.setField(internshipRequest.getField());
        internship.setDuration(internshipRequest.getDuration());
        internship.setStartDate(internshipRequest.getStartDate());
        internship.setEndDate(internshipRequest.getEndDate());
        internship.setCompensation(internshipRequest.getCompensation());
        internship.setApplicationDeadline(internshipRequest.getApplicationDeadline());
        // Appelez le service pour créer l'internship avec les requirements
        Internship savedInternship = internshipService.addInternshipWithRequirements(
                internship, internshipRequest.getRequirementNames(), companyId);

        return new ResponseEntity<>(savedInternship, HttpStatus.CREATED);
    }

    @PutMapping("/updateIntership/{id}")
    public ResponseEntity<?> updateInternship(@PathVariable("id") int id,@RequestBody Internship internship){
        Internship savedInternship = internshipService.updateInternship(internship, id);
        return new ResponseEntity<>(savedInternship, HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Internship>> GetAllInternship(){
        return new ResponseEntity<>(internshipService.GetAllInternship(), HttpStatus.OK);
    }
    @GetMapping("/listById/{userId}")
    public List<Internship> GetAllInternshipByCompany(@PathVariable String userId){
        return internshipService.getInternshipByUserId(userId);
    }
    @GetMapping("/requirements")
    public ResponseEntity<List<Requirement>>  getAvailableRequirements(){
        return new ResponseEntity<>(internshipService.getAvailableRequirements(), HttpStatus.OK);
    }
    @DeleteMapping(("/deleteInternship/{idInternship}"))
    public void deleteInternship(@PathVariable("idInternship") int idInternship){
        internshipService.deleteInternship(idInternship);
    }
    @GetMapping("/findInternshipById/{id}")
    public ResponseEntity<Internship> getInternshipById(@PathVariable("id") int id){
        return new ResponseEntity<>(internshipService.getInternshipById(id), HttpStatus.OK);
    }
    // Exposer une API REST pour récupérer le stage le mieux adapté pour un étudiant
    @GetMapping("/matchInternships")
    public List<Internship> matchInternships(@RequestHeader("userId") String userId) {
        return matchmakingService.matchInternships(userId, internshipService.GetAllInternship());
    }
}

