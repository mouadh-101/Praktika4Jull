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

import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class IntenshipController {
    @Autowired
    private InternshipService internshipService;

    @PostMapping("/addIntership")
    public ResponseEntity<?> addInternship(@RequestBody Internship internship){
        Internship savedInternship = internshipService.addInternship(internship);
        return new ResponseEntity<>(savedInternship, HttpStatus.CREATED);
    }
    @PostMapping("/addIntership1/{companyId}")
    public ResponseEntity<?> addInternshipWithRequirements(
            @RequestBody @Valid InternshipRequest internshipRequest,
            @PathVariable int companyId){
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
}

