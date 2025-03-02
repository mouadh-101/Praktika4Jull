package tn.esprit.gestion_convention.services;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;
import tn.esprit.gestion_convention.repositories.IConventionRepo;
import tn.esprit.gestion_convention.repositories.ITermsRepo;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class IConventionServiceImpl implements IConventionService{
    @Autowired
    IConventionRepo conventionRepo;
    @Autowired
    ITermsRepo ItermsRepo;
    private final ITermsService ITermsService; // Injection du service
    @Override
    public List<Convention> getAllConventions() {
        return conventionRepo.findAll();
    }


    @Override
    public Convention getConventionById(Integer id) {
        return conventionRepo.findById(id).orElse(null);
    }

    @Override
    public Convention saveConvention(Convention convention) {
        convention.setDateConv(new Date()); // Définir la date actuelle

        // Vérifier si la convention contient des termes et les associer
        if (convention.getTerms() != null && !convention.getTerms().isEmpty()) {
            convention.getTerms().forEach(term -> term.setConvention(convention));
        }

        return conventionRepo.save(convention); // Sauvegarde en cascade (grâce à @OneToMany)
    }


    @Override
    public void deleteConvention(Integer id) {
        conventionRepo.deleteById(id);
    }


    @Override
    @Transactional
    public Convention updateConvention(Integer id, Convention convention) {
        return conventionRepo.findById(id).map(existing -> {
            // Mise à jour des champs simples
            existing.setDateConv(new Date()); // Définit la date actuelle au format java.util.Date
            existing.setDescription(convention.getDescription());
            existing.setSigned(convention.getSigned());
            existing.setInternshipId(convention.getInternshipId());

            // Gestion des termes
            List<Terms> incomingTerms = convention.getTerms();
            List<Terms> existingTerms = existing.getTerms();

            // Suppression des termes non présents
            existingTerms.removeIf(existingTerm ->
                    incomingTerms.stream().noneMatch(t -> t.getTermId().equals(existingTerm.getTermId()))
            );

            // Mise à jour/ajout des termes
            incomingTerms.forEach(term -> {
                if(term.getTermId() != null) {
                    // Appel correct au service avec les deux paramètres
                    Terms updatedTerm = ITermsService.updateTerms(term.getTermId(), term);
                    existing.getTerms().add(updatedTerm);
                } else {
                    term.setConvention(existing);
                    existing.getTerms().add(term);
                }
            });

            return conventionRepo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Convention introuvable avec l'ID: " + id));
    }

    @Override
    public Convention affecterTerm(Integer id, Integer idTerm) {
        Convention convention = conventionRepo.findById(id).orElse(null);
        Terms terms = ItermsRepo.findById(idTerm).orElse(null);
        convention.getTerms().add(terms);
        return conventionRepo.save(convention);
    }

    // Méthode de filtrage des conventions par date

    @Override
    public List<Convention> filterConventionsByDate(Date startDate, Date endDate) {
        // Définir la Specification pour filtrer par date
        Specification<Convention> dateFilterSpec = (Root<Convention> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            return criteriaBuilder.between(root.get("DateConv"), startDate, endDate);
        };

        // Utiliser findAll avec la Specification
        return conventionRepo.findAll(dateFilterSpec);
    }
    @Override
    public Long countConventionsByMonthAndYear(int month, int year) {
        // Appeler la méthode du repository pour obtenir le nombre de conventions par mois et année
        return conventionRepo.countConventionsByMonthAndYear(month, year);
    }


}
