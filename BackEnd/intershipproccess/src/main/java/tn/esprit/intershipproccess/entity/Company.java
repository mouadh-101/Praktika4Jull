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
public class Company {
    @Id
    String userId;
    String industry;
    String website;
    String description;
    String logo;
    @JsonIgnore
@OneToMany(mappedBy = "company")
    List<Internship> internships;
}
