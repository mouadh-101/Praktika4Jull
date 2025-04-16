package esprit.microservice1.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAnswerDTO {
    private Long questionId;
    private Long selectedAnswerId;
}
