package org.esprit.student.service.Interface;

import org.esprit.student.entity.WorkExperience;
import org.springframework.http.ResponseEntity;

public interface IWorkExperienceService {
<<<<<<< HEAD
    WorkExperience addWorkExperience(WorkExperience WorkExperience);
=======
    WorkExperience addWorkExperience(WorkExperience WorkExperience,String id);
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    WorkExperience updateWorkExperience(Long id ,WorkExperience WorkExperience);
    void deleteWorkExperience(Long id);
    ResponseEntity<WorkExperience> getWorkExperience(Long id);
}
