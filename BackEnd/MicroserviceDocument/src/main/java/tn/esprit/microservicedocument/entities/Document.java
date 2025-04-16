package tn.esprit.microservicedocument.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long Docid;
    String societe;
    @Enumerated(EnumType.STRING)
    Type type;
    @Enumerated(EnumType.STRING)
    Duree duree;

    LocalDate dateDebut;
    LocalDate dateFin;
    @Enumerated(EnumType.STRING)
    StatusDoc statusDoc= StatusDoc.ENATTEND;
    @JsonIgnore
    @OneToOne(mappedBy = "document",cascade = CascadeType.ALL)
    Depot depot  ;
    @OneToMany(mappedBy = "document",cascade = CascadeType.ALL)
    Set<Journal> journals;
    public void validerStatus() {
        this.statusDoc = StatusDoc.VALIDE;
    }

    public void refuserStatus() {
        this.statusDoc = StatusDoc.REFUSER;
    }

}
