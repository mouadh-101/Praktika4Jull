package esprit.microservice1.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class AnswerEx {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    private boolean correct;

    @ManyToOne
    @JsonIgnore
    private QuestionEx question;
}
