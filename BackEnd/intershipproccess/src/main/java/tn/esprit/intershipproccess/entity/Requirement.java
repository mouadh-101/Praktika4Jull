package tn.esprit.intershipproccess.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Requirement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id ;
    String name;
    String field;
    @JsonIgnore
    @ManyToMany(mappedBy = "requirements")
    List<Internship> internships ;
}
