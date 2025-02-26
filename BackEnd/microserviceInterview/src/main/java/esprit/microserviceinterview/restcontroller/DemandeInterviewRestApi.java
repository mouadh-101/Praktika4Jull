package esprit.microserviceinterview.restcontroller;


import esprit.microserviceinterview.entities.DemandeInterview;
import esprit.microserviceinterview.entities.Interview;
import esprit.microserviceinterview.services.DemandeInterviewService;
import esprit.microserviceinterview.services.InterviewService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/interview/demande")
public class DemandeInterviewRestApi {
    @Autowired
    DemandeInterviewService demandeInterviewService;

    @PostMapping(path = "/AddDemandeInterview")
    DemandeInterview ajouterDemandeInterview (@RequestBody DemandeInterview demandeInterview)
    {return demandeInterviewService.ajouterDemandeInterview(demandeInterview);}

    @DeleteMapping(path = "/DemandeInterview/{id}")
    void supprimerDemandeInterview(@PathVariable Long id)
    {demandeInterviewService.supprimerDemandeInterview(id);}

    @PutMapping(path = "/DemandeInterview/update")
    DemandeInterview updateDemandeInterview(@RequestBody DemandeInterview demandeInterview)
    {return demandeInterviewService.updateDemandeInterview(demandeInterview);}

    @GetMapping(path = "/DemandeInterview/{id}")
    Optional<DemandeInterview> chercherDemandeInterview(@PathVariable Long id)
    {return demandeInterviewService.chercherDemandeInterview(id);}

    @GetMapping("/list")
    public ResponseEntity<List<DemandeInterview>> getAll() {
        return new ResponseEntity<>(demandeInterviewService.getAll(), HttpStatus.CREATED);
    }
}
