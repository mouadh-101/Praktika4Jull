package tn.esprit.gestion_convention.services;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;
import tn.esprit.gestion_convention.repositories.IConventionRepo;
import tn.esprit.gestion_convention.repositories.ITermsRepo;

import java.util.List;

@Service
@AllArgsConstructor
public class ITermsImpl implements ITermsService {
    @Autowired
    ITermsRepo ItermsRepo;
    IConventionRepo conventionRepo;

    public List<Terms> getAllTerms() {
        List<Terms> terms = ItermsRepo.findAll();
        if (terms.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "Aucun terme trouvé dans la base de données.");
        }
        return terms;
    }


    @Override
    public Terms getTermsById(Integer id) {
        Terms term = ItermsRepo.findById(id).orElse(null);
        if (term == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Le terme avec l'ID " + id + " n'a pas été trouvé.");
        }
        return term;
    }

    @Override
    public Terms saveTerms(Terms terms) {

        return ItermsRepo.save(terms);
    }

    @Override
    public void deleteTerms(Integer id) {
        ItermsRepo.deleteById(id);
    }

    @Override
    public Terms updateTerms(Terms terms) {
        // Vérifier si le Term existe dans la base de données
        return ItermsRepo.findById(terms.getTermId()).map(existingTerm -> {
            // Mise à jour des champs du Term
            existingTerm.setTitle(terms.getTitle());
            existingTerm.setDescription(terms.getDescription());

            // Vérifier si la Convention associée existe
            if (terms.getConvention() != null && terms.getConvention().getConId() != null) {
                conventionRepo.findById(terms.getConvention().getConId()).ifPresent(existingTerm::setConvention);
            }

            return ItermsRepo.save(existingTerm);
        }).orElse(null);
    }





}
