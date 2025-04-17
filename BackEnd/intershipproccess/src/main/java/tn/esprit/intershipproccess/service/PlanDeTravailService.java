package tn.esprit.intershipproccess.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.intershipproccess.entity.*;
import tn.esprit.intershipproccess.repository.CompanyRepository;
import tn.esprit.intershipproccess.repository.PlanDeTravailRepository;
import tn.esprit.intershipproccess.repository.TacheGanttRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlanDeTravailService {
    @Autowired
    private PlanDeTravailRepository planDeTravailRepository;

    @Autowired
    private TacheGanttRepository tacheGanttRepository;
    @Autowired
    private CompanyRepository companyRepository;

    public PlanDeTravail createPlanDeTravail(PlanDeTravail plan) {

        if (plan.getPlanning() != null) {
            plan.getPlanning().forEach(t -> t.setPlanDeTravail(plan));
        }

        return planDeTravailRepository.save(plan);
    }

    public List<PlanDeTravailDto> getAllPlans() {
        List<PlanDeTravail> plans = planDeTravailRepository.findAll();
        return plans.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private PlanDeTravailDto mapToDto(PlanDeTravail plan) {
        PlanDeTravailDto dto = new PlanDeTravailDto();
        dto.setId(plan.getId());
        dto.setDescription(plan.getDescription());
        dto.setProblematique(plan.getProblematique());
        dto.setFonctionnalites(plan.getFonctionnalites());
        dto.setTechnologies(plan.getTechnologies());
        dto.setStatut(plan.getStatut());
        dto.setFichierRemis(plan.getFichierRemis());
        dto.setEncadrantInterne(plan.getEncadrantInterne());
        dto.setEncadrantExterne(plan.getEncadrantExterne());
        dto.setCompany(plan.getCompany());


        if (plan.getPlanning() != null) {
            List<TacheDto> taches = plan.getPlanning().stream().map(t -> {
                TacheDto tacheDto = new TacheDto();
                tacheDto.setId(t.getId());
                tacheDto.setNomTache(t.getNomTache());
                tacheDto.setDateDebut(t.getDateDebut());
                tacheDto.setDateFin(t.getDateFin());
                return tacheDto;
            }).collect(Collectors.toList());

            dto.setPlanning(taches);
        }

        return dto;
    }
}
