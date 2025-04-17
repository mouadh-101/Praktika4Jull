package tn.esprit.intershipproccess.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TacheDto {
    private Long id;
    private String nomTache;
    private LocalDate dateDebut;
    private LocalDate dateFin;
}

