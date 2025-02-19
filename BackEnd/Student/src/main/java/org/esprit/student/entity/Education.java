package org.esprit.student.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Education{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String schoolName;
    String degree;
    LocalDate startDate;
    @Column(nullable = true)
    LocalDate endDate;
    @ManyToOne
    private Student student;
    
}
