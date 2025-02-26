package tn.esprit.gestion_convention.restcontroller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;
import tn.esprit.gestion_convention.repositories.IConventionRepo;
import tn.esprit.gestion_convention.repositories.ITermsRepo;
import tn.esprit.gestion_convention.services.IConventionService;
import tn.esprit.gestion_convention.services.ITermsService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/conventions")

public class ConventionController {
    @Autowired
    IConventionService IconventionService;
    @Autowired
    ITermsService ITermsService;
    @Autowired
    ITermsRepo termsRepo;
// lister les conventions
    @GetMapping
    public List<Convention> getAllConventions() {
        return IconventionService.getAllConventions();
    }
// getById
@GetMapping("/{id}")
public Convention getConventionById(@PathVariable Integer id) {
    return IconventionService.getConventionById(id);
}
// ajouter une convention
@PostMapping("/add")
public Convention addConvention(@RequestBody Convention convention) {
    // Pour chaque terme dans la liste des termes, associez-le à la convention
    return IconventionService.saveConvention(convention);
}

    // supprimer une convention
    @DeleteMapping("/delete/{id}")
    public void deleteConvention(@PathVariable Integer id) {
        IconventionService.deleteConvention(id);
    }

    // modifier une convention
    @PutMapping("/update/{id}")
    public ResponseEntity<Convention> updateConvention(@PathVariable Integer id, @RequestBody Convention convention) {
        // Vérifier si la convention existe
        Convention existingConvention = IconventionService.getConventionById(id);

        if (existingConvention != null) {
            // Mettre à jour les champs nécessaires
            existingConvention.setSigned(convention.getSigned());
            existingConvention.setDescription(convention.getDescription());
            existingConvention.setTerms(convention.getTerms());
            existingConvention.setDateConv(convention.getDateConv());
            existingConvention.setInternshipId(convention.getInternshipId());

            // Sauvegarde et retour de l'objet mis à jour
            Convention savedConvention = IconventionService.saveConvention(existingConvention);
            return ResponseEntity.ok(savedConvention);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }



    // affecter un terme a une convention
    @PutMapping("/affecter/{id}/{idTerm}")
    public Convention affecterTerm(@PathVariable Integer id, @PathVariable Integer idTerm) {
        return IconventionService.affecterTerm(id, idTerm);
    }
    // Méthode pour filtrer les conventions par date
    @GetMapping("/filter/{startDate}/{endDate}")
    public List<Convention> filterConventionsByDate(
            @PathVariable String startDate,
            @PathVariable String endDate) {

        // Convertir les chaînes de date en objets Date
        Date start = convertToDate(startDate);
        Date end = convertToDate(endDate);

        // Vérifier si la conversion a réussi
        if (start == null || end == null) {
            throw new IllegalArgumentException("Les dates fournies ne sont pas valides.");
        }

        // Appeler le service pour filtrer les conventions
        return IconventionService.filterConventionsByDate(start, end);
    }

    // Méthode pour convertir la chaîne en Date
    private Date convertToDate(String dateStr) {
        try {
            return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").parse(dateStr);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;  // Retourne null si la conversion échoue
        }
    }

    // Endpoint pour obtenir le nombre de conventions pour un mois et une année donnés
    @GetMapping("/stats/count/{month}/{year}")
    public Long getConventionCountByMonthAndYear(
            @PathVariable int month,
            @PathVariable int year) {
        return IconventionService.countConventionsByMonthAndYear(month, year);  // Appel à la méthode du service
    }
    }


