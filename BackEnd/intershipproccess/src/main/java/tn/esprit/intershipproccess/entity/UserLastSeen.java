package tn.esprit.intershipproccess.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_last_seen")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserLastSeen {
    @Id
    @Column(nullable = false, unique = true) // userId est obligatoire et unique
    private String userId;

    @Column(nullable = false)
    private LocalDateTime lastSeen; // Stocke la date et l'heure de la dernière connexion

}
