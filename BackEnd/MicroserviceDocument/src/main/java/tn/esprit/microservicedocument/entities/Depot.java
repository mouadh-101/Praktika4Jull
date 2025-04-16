package tn.esprit.microservicedocument.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.print.Doc;
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
    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    Document document ;
}
