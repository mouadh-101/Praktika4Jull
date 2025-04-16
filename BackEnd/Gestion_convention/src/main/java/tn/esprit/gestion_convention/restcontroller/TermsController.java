package tn.esprit.gestion_convention.restcontroller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;
import tn.esprit.gestion_convention.repositories.ITermsRepo;
import tn.esprit.gestion_convention.services.IConventionService;
import tn.esprit.gestion_convention.services.ITermsService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/conventions/terms")

public class TermsController {
    @Autowired
    ITermsService ITermsService;
    IConventionService IconventionService;


    // ajouter un terme
    @PostMapping("/add")
    public Terms addTerms(@RequestBody Terms terms) {
        return ITermsService.saveTerms(terms);
    }

    // supprimer un terme
    @DeleteMapping("/delete/{id}")
    public void deleteTerms(@PathVariable Integer id) {
        ITermsService.deleteTerms(id);
    }
    @PutMapping("/update/{idT}")
    public ResponseEntity<Terms> updateTerms(@PathVariable Integer idT, @RequestBody Terms terms) {
        // Vérifier si le terme existe avant la mise à jour
        Terms existingTerm = ITermsService.getTermsById(idT);

        if (existingTerm == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Mettre à jour les champs
        existingTerm.setTitle(terms.getTitle());
        existingTerm.setDescription(terms.getDescription());

        // Vérifier si une nouvelle Convention est envoyée et existe
        if (terms.getConvention() != null && terms.getConvention().getConId() != null) {
            Convention convention = IconventionService.getConventionById(terms.getConvention().getConId());
            if (convention != null) {
                existingTerm.setConvention(convention);
            }
        }

        Terms updatedTerm = ITermsService.updateTerms(idT, existingTerm);
        return ResponseEntity.ok(updatedTerm);
    }

    // recuperer tous les termes
    @GetMapping("/all")
    public List<Terms> getAllTerms() {
        return ITermsService.getAllTerms();
    }
    // recuperer un terme par son id
    @GetMapping("/get/{id}")
    public Terms getTermsById(@PathVariable Integer id) {
        return ITermsService.getTermsById(id);
    }

}
