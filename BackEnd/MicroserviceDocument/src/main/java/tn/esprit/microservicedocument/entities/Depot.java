package tn.esprit.microservicedocument.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Depot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idDepot;

    @Column(columnDefinition = "LONGBLOB")
    private byte[] Rapport ;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] Journal ;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] Attestation ;
    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadDate;
}
