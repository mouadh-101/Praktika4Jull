package tn.esprit.intershipproccess.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class PlanDeTravail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String problematique;
    private String fonctionnalites;
    private String technologies;

    private String fichierRemis;
    private String statut;


    private String company;

    private String encadrantInterne;
    private String encadrantExterne;

    @OneToMany(mappedBy = "planDeTravail",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TacheGantt> planning;
}
