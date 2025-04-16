package esprit.microservice1.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import esprit.microservice1.entity.ExamenParticipant;
import esprit.microservice1.entity.Formation;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class User {
    @Id
    @GeneratedValue
    private Integer userId;
    private String username;
    private String lastname;
    private String name;
    private String email;
    private String password;

    @OneToMany(cascade = CascadeType.ALL, mappedBy="user")
    @JsonIgnore
    private List<Post> Posts;
    @OneToMany(cascade = CascadeType.ALL, mappedBy="user")
    @JsonIgnore
    private List<Like> likes ;
    @OneToMany(cascade = CascadeType.ALL, mappedBy="user")
    @JsonIgnore
    private List<Comment> Comments;



}
