package esprit.microservice1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;


import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "ourusers")
@Data
public class OurUsers  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String email;
    private String name;
    private String password;
    private String city;
    private String image;
    private Long numTel;
    private Long CIN;
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.PENDING; // Par défaut, un MODERATOR est "PENDING"




}
