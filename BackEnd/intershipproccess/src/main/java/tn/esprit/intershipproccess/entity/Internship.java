package tn.esprit.intershipproccess.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
        import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Internship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id ;
    String titre ;
    @Lob
    @Column(columnDefinition = "TEXT")
    String description;
    String location;
    boolean remote;
    String field;
    int duration;
    LocalDate startDate;
    LocalDate endDate;
    BigDecimal compensation;
    @CreatedDate
    @Column(updatable = false,nullable = false)
    LocalDateTime createAt;

    @LastModifiedDate
    @Column(insertable = false , nullable = true)
    LocalDateTime lastModifiedDate;

    LocalDate applicationDeadline;
    Status status;

    @ManyToMany
    List<Requirement> requirements = new ArrayList<>();;
    @ManyToOne
    Company company;
}
