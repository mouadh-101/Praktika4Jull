package tn.esprit.intershipproccess.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.function.EntityResponse;
import tn.esprit.intershipproccess.entity.Company;
import tn.esprit.intershipproccess.entity.Internship;
import tn.esprit.intershipproccess.entity.Requirement;
import tn.esprit.intershipproccess.entity.Status;
import tn.esprit.intershipproccess.repository.CompanyRepository;
import tn.esprit.intershipproccess.repository.InternshipRepository;
import tn.esprit.intershipproccess.repository.RequirementRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service

public class InternshipService {
    @Autowired
    private InternshipRepository internshipRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private RequirementRepository requirementRepository;
    public Internship addInternship(Internship internship){
        Company staticCompany = new Company();
        staticCompany.setIndustry("Informatique");
        staticCompany.setWebsite("www.informatique.com");
        staticCompany.setLogo("hjkj");
        staticCompany.setDescription("une sosite de fabrication de vjgv bjhb");
        Company savedCompany = companyRepository.save(staticCompany);
        internship.setCompany(savedCompany);
        internship.setLastModifiedDate(LocalDateTime.now());
        return internshipRepository.save(internship);
    }
    public Internship addInternshipWithRequirements(Internship internship, List<String> requirementNames, String companyId) {
        // Récupérer la company par son ID
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("La société avec l'ID " + companyId + " n'existe pas"));

        // Ajouter les requirements à l'internship
        for (String requirementName : requirementNames) {
            Requirement requirement = requirementRepository.findByName(requirementName);

            if (requirement == null) {
                // Si le requirement n'existe pas, on le crée
                requirement = new Requirement();
                requirement.setName(requirementName);
                requirement.setField(internship.getField());
                requirementRepository.save(requirement);  // Sauvegarde dans la table Requirement
            }

            // Ajouter le requirement à l'internship
            internship.getRequirements().add(requirement);
        }

        // Associer la société à l'internship
        internship.setCompany(company);
internship.setStatus(Status.OPEN);
        // Sauvegarder l'internship
        return internshipRepository.save(internship);
    }

    public Internship updateInternship(Internship internshipp,int id){

        return internshipRepository.findById(id).map(internship -> {
            internship.setTitre(internshipp.getTitre());
            internship.setDescription(internshipp.getDescription());
            internship.setLocation(internshipp.getLocation());
            internship.setRemote(internshipp.isRemote());
            internship.setField(internshipp.getField());
            internship.setDuration(internshipp.getDuration());
            internship.setStartDate(internshipp.getStartDate());
            internship.setEndDate(internshipp.getEndDate());
            internship.setCompensation(internshipp.getCompensation());
            internship.setApplicationDeadline(internshipp.getApplicationDeadline());
            internship.setStatus(internshipp.getStatus());
            internship.setLastModifiedDate(LocalDateTime.now());
            internship.setRequirements(internshipp.getRequirements());
            return internshipRepository.save(internship);
        }).orElseThrow(() -> new RuntimeException("Internship not found with ID: " + id));
    }
    public void deleteInternship(int idInternship){
       internshipRepository.deleteById(idInternship);
    }
    public List<Internship> GetAllInternship(){
        return  internshipRepository.findAll();
    }
    public Internship getInternshipById(int id){
        return internshipRepository.findById(id).orElse(null);
    }
    public List<Requirement> getAvailableRequirements(){
        return requirementRepository.findAll();
    }

    public List<Internship> getInternshipsWithFilters(String location, Integer duration, BigDecimal compensation, String field, Boolean remote) {
        return internshipRepository.findByFilters(location, duration, compensation, field, remote);
    }

}
