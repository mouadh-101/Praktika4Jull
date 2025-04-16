package esprit.microservice1.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Diplome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String path;
    Long iduser;
    public String getPath() {
        return path;
    }

    public Diplome setPath(String path) {
        this.path = path;
        return this;
    }

    public Long getIduser() {
        return iduser;
    }

    public Diplome setIduser(Long iduser) {
        this.iduser = iduser;
        return this;
    }

    public LocalDate getDateObtention() {
        return dateObtention;
    }

    public void setDateObtention(LocalDate dateObtention) {
        this.dateObtention = dateObtention;
    }

    public Formation getFormation() {
        return formation;
    }

    public void setFormation(Formation formation) {
        this.formation = formation;
    }

    private LocalDate dateObtention;

    @ManyToOne
    @JoinColumn(name = "formation_id")
    private Formation formation;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public OurUsers getUser() {
        return user;
    }

    public void setUser(OurUsers user) {
        this.user = user;
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private OurUsers user;

}
