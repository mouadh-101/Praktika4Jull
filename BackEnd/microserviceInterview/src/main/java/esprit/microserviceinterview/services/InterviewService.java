package esprit.microserviceinterview.services;


import esprit.microserviceinterview.entities.Interview;
import esprit.microserviceinterview.repositories.InterviewRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class InterviewService implements IServiceInterview{
    @Autowired
    InterviewRepo interviewRepo;

    @Override
    public Interview ajouterInterview(Interview interview)
    {
        return interviewRepo.save(interview);
    }

    @Override
    public void supprimerInterview(Long id)
    {
        interviewRepo.deleteById(id);
    }

    @Override
    public Interview updateInterview(Long id,Interview interview)
    {
        Interview i=interviewRepo.findById(id).orElse(null);
        i.setDateInterview(interview.getDateInterview());
        i.setLocation(interview.getLocation());
        i.setNotes(interview.getNotes());
        i.setStatus(interview.getStatus());
        return interviewRepo.save(i);
    }

    @Override
    public Optional<Interview> chercherInterview(Long id)
    {
        return interviewRepo.findById(id);
    }

    @Override
    public List<Interview> getAll() {
        return interviewRepo.findAll();
    }

}


