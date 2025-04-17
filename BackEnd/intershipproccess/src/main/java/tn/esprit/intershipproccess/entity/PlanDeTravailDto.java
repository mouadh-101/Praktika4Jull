package tn.esprit.intershipproccess.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PlanDeTravailDto {
    private Long id;
    private String description;
    private String problematique;
    private String fonctionnalites;
    private String technologies;
    private String statut;
    private String fichierRemis;
    private String encadrantInterne;
    private String encadrantExterne;
    private String company;
    private List<TacheDto> planning;
}
