package esprit.microservice1.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "likes")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLike;

    @ManyToOne
    @JsonIgnore
    private User user;

    @ManyToOne
    @JsonIgnore
    private Post post;
}
