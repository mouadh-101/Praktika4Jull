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
public class DemandeInterview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    int DemandeInterviewId ;
    @Enumerated(EnumType.STRING)
    StatusDemandeInterview statuss;
    Date Date1;
    Date Date2;
    Date Date3;
    boolean IsRemote;
    String Description;
    String Location;

    @OneToOne
    Interview interview;


}
