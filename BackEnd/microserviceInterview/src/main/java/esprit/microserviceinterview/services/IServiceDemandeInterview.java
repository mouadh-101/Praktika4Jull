package esprit.microserviceinterview.services;

import esprit.microserviceinterview.entities.DemandeInterview;
import esprit.microserviceinterview.entities.Interview;

import java.util.List;
import java.util.Optional;

public interface IServiceDemandeInterview {


    DemandeInterview ajouterDemandeInterview(DemandeInterview demandeInterview) ;

    void supprimerDemandeInterview(Long id);
    DemandeInterview updateDemandeInterview(DemandeInterview demandeInterview);
    Optional<DemandeInterview> chercherDemandeInterview(Long id);
    List<DemandeInterview> getAll();
}
