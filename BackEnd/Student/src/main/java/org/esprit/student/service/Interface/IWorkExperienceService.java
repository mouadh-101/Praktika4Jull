package org.esprit.student.service.Interface;

import org.esprit.student.entity.WorkExperience;
import org.springframework.http.ResponseEntity;

public interface IWorkExperienceService {
    WorkExperience addWorkExperience(WorkExperience WorkExperience,String id);
    WorkExperience updateWorkExperience(Long id ,WorkExperience WorkExperience);
    void deleteWorkExperience(Long id);
    ResponseEntity<WorkExperience> getWorkExperience(Long id);
}