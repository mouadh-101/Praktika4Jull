package esprit.microserviceinterview.services;

import esprit.microserviceinterview.entities.DemandeInterview;
import esprit.microserviceinterview.repositories.DemandeInterviewRepo;
import esprit.microserviceinterview.repositories.InterviewRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DemandeInterviewService implements IServiceDemandeInterview{

    @Autowired
    DemandeInterviewRepo demandeInterviewRepo;

    @Override
    public DemandeInterview ajouterDemandeInterview(DemandeInterview demandeInterview) {
        return demandeInterviewRepo.save(demandeInterview);
    }

    @Override
    public void supprimerDemandeInterview(Long id) {
        demandeInterviewRepo.deleteById(id);
    }

    @Override
    public DemandeInterview updateDemandeInterview(DemandeInterview demandeInterview) {
        return demandeInterviewRepo.save(demandeInterview);
    }

    @Override
    public Optional<DemandeInterview> chercherDemandeInterview(Long id) {
        return demandeInterviewRepo.findById(id);
    }

    @Override
    public List<DemandeInterview> getAll() {
        return demandeInterviewRepo.findAll();
    }
}
