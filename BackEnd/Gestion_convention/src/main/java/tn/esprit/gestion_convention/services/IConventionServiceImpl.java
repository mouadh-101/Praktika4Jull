package tn.esprit.gestion_convention.services;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import tn.esprit.gestion_convention.entities.Convention;
import tn.esprit.gestion_convention.entities.Terms;
import tn.esprit.gestion_convention.repositories.IConventionRepo;
import tn.esprit.gestion_convention.repositories.ITermsRepo;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
 public class IConventionServiceImpl implements IConventionService{
    private final tn.esprit.gestion_convention.repositories.ITermsRepo ITermsRepo;
    IConventionRepo conventionRepo;
    @Autowired
    ITermsRepo ItermsRepo;

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
        convention.setDateConv(new Date());
        if (convention.getTerms() != null) {
            for (Terms term : convention.getTerms()) {
                term.setConvention(convention); // Associer le terme à la convention
            }
        }
        return conventionRepo.save(convention);
    }


    @Override
    public void deleteConvention(Integer id) {
        conventionRepo.deleteById(id);
    }

    @Override
    public Convention updateConvention(Convention convention) {
        return conventionRepo.save(convention);
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
