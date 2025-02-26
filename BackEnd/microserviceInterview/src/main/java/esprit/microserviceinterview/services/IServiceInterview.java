package esprit.microserviceinterview.services;

import esprit.microserviceinterview.entities.Interview;

import java.util.List;
import java.util.Optional;

public interface IServiceInterview {


    Interview ajouterInterview(Interview interview) ;

    void supprimerInterview(Long id);
    Interview updateInterview(Interview interview);
    Optional<Interview> chercherInterview(Long id);
    List<Interview> getAll();


}
