package tn.esprit.intershipproccess.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Favoris {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id ;
    String userId;
    @ManyToOne
    Internship internship;
    @CreatedDate
    @Column(updatable = false,nullable = false)
    LocalDateTime createAt;

}
