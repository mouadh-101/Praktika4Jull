package esprit.microservice1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Examen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Enumerated(EnumType.STRING)
    private TypeExamen ExamenT; // oral ou écrit
    @OneToMany(mappedBy = "examen", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ExamenParticipant> participants;
    private String session; // principale ou contrôle
    private LocalDate date;
    private Integer duree; // en minutes

    @ManyToOne
    @JoinColumn(name = "formation_id")
    private Formation formation;
    @OneToMany(mappedBy = "exam",fetch = FetchType.LAZY)
    private List<QuestionEx> questions;



    public Long getId() {
        return id;
    }

    public Examen setId(Long id) {
        this.id = id;
        return this;
    }

    public String getTitre() {
        return titre;
    }

    public Examen setTitre(String titre) {
        this.titre = titre;
        return this;
    }


    public TypeExamen getExamenT() {
        return ExamenT;
    }

    public Examen setExamenT(TypeExamen examenT) {
        ExamenT = examenT;
        return this;
    }

    public List<ExamenParticipant> getParticipants() {
        return participants;
    }

    public Examen setParticipants(List<ExamenParticipant> participants) {
        this.participants = participants;
        return this;
    }

    public String getSession() {
        return session;
    }

    public Examen setSession(String session) {
        this.session = session;
        return this;
    }

    public LocalDate getDate() {
        return date;
    }

    public Examen setDate(LocalDate date) {
        this.date = date;
        return this;
    }

    public Integer getDuree() {
        return duree;
    }

    public Examen setDuree(Integer duree) {
        this.duree = duree;
        return this;
    }

    public Formation getFormation() {
        return formation;
    }

    public Examen setFormation(Formation formation) {
        this.formation = formation;
        return this;
    }


}
