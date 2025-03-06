package tn.esprit.microservicedocument.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

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
    public void validerStatus() {
        this.statusDoc = StatusDoc.VALIDE;
    }

    public void refuserStatus() {
        this.statusDoc = StatusDoc.REFUSER;
    }

}
