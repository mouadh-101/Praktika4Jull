package esprit.microservice1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import esprit.microservice1.entities.User;
import jakarta.persistence.*;

import java.util.List;


@Entity
    public class Formation {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String titre;
        private String description;
        @Enumerated(EnumType.STRING)
        private  TypeFormation FormationT;
        private String niveau;
    @ElementCollection
    @CollectionTable(
            name = "formation_users",
            joinColumns = @JoinColumn(name = "formation_id")
    )
    @Column(name = "user_id")
    private List<Integer> userIds;


         @JsonIgnore
        @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
        private List<Examen> examenList;
    @JsonIgnore
        @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
        private List<Diplome> diplomeList;
    public String getDescription() {
        return description;
    }

    public List<Integer> getUserIds() {
        return userIds;
    }

    public Formation setUserIds(List<Integer> userIds) {
        this.userIds = userIds;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public TypeFormation getFormationT() {
        return FormationT;
    }

    public void setFormationT(TypeFormation formationT) {
        FormationT = formationT;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Examen> getExamenList() {
        return examenList;
    }

    public Formation setExamenList(List<Examen> examenList) {
        this.examenList = examenList;
        return this;
    }

    public List<Diplome> getDiplomeList() {
        return diplomeList;
    }

    public Formation setDiplomeList(List<Diplome> diplomeList) {
        this.diplomeList = diplomeList;
        return this;
    }
}



