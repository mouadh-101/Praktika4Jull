package esprit.microservice1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionEx {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;

    @ManyToOne
    @JsonIgnore
    private Examen exam;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AnswerEx> answers;

}
