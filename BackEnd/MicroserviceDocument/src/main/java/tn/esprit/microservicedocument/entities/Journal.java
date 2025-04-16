package tn.esprit.microservicedocument.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Journal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idJournal;
    private String tache;
    private Date dateJournal;


    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    Document document;
}
