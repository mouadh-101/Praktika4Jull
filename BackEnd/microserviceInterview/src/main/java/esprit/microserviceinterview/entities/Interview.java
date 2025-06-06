package esprit.microserviceinterview.entities;


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
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    int InterviewId ;
    Date DateInterview;
    String Location;
    String Notes;
    @Enumerated(EnumType.STRING)
    StatusInterv Status;
    String interviewLink;
    String companyId ;
    String studentId ;
    @OneToOne
    DemandeInterview demandeInerview;
}


