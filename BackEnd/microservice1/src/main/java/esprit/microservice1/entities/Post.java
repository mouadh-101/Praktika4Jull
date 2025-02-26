package esprit.microservice1.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
public class Post {
    @Id
    @GeneratedValue
    private int idPost;
    private String image;
    private String description;
    private LocalDate datePost;

    @ManyToOne
    @JsonIgnore
    User user;

    @OneToMany(cascade = CascadeType.ALL, mappedBy="post", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("post") // pour éviter la récursion infinie
    private List<Comment> Comments;

}
