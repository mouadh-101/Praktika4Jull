package org.esprit.student.service.Interface;
import org.esprit.student.controller.dto.ASIDto;
import org.esprit.student.controller.dto.AnalyzeDto;
import org.esprit.student.controller.dto.ApplicationDto;
import org.esprit.student.entity.Application;

import java.util.List;

public interface IApplicationService {
    Application addApplication(Application Application,String userId ,int internshipId);
    Application updateApplication(Long id,Application Application);
    void deleteApplication(Long id);
    ApplicationDto getApplication(Long id);
    List<ApplicationDto> getStudentApplication(String userId);
    ASIDto getASI(Long id);
    List<ASIDto> getAllStudentApplication(String userId);
    List<ASIDto> getAllCompanyApplication(String userId);

    AnalyzeDto getAnalyze(Long id);

}
