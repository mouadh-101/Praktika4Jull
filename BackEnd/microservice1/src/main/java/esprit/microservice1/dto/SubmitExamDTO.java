package esprit.microservice1.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class SubmitExamDTO {
    private Long examId;
    private List<UserAnswerDTO> answers;
}

