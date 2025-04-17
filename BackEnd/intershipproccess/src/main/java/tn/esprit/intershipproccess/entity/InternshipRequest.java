package tn.esprit.intershipproccess.entity;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InternshipRequest {

    @NotNull(message = "Le titre est obligatoire")
    @NotBlank(message = "Le titre ne peut pas être vide")
    private String titre;

    @NotNull(message = "La description est obligatoire")
    @NotBlank(message = "La description ne peut pas être vide")
    private String description;

    @NotNull(message = "L'emplacement est obligatoire")
    @NotBlank(message = "L'emplacement ne peut pas être vide")
    private String location;

    private boolean remote;

    @NotNull(message = "Le domaine est obligatoire")
    @NotBlank(message = "Le domaine ne peut pas être vide")
    private String field;

    @Min(value = 1, message = "La durée doit être d'au moins 1 mois")
    @Max(value = 12, message = "La durée ne peut pas excéder 12 mois")
    private int duration;

    @FutureOrPresent(message = "La date de début doit être aujourd'hui ou dans le futur")
    private LocalDate startDate;

    @FutureOrPresent(message = "La date de fin doit être aujourd'hui ou dans le futur")
    private LocalDate endDate;

    @DecimalMin(value = "0.0", inclusive = false, message = "La compensation doit être positive")
    private BigDecimal compensation;

    @NotNull(message = "La date limite de candidature est obligatoire")
    @Future(message = "La date limite de candidature doit être dans le futur")
    private LocalDate applicationDeadline;

    @NotNull(message = "La liste des exigences est obligatoire")
    @Size(min = 1, message = "Il faut au moins une exigence")
    private List<String> requirementNames;
}
