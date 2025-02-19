package org.esprit.student.service.Interface;

import org.esprit.student.entity.WorkExperience;

public interface IWorkExperienceService {
    WorkExperience addWorkExperience(WorkExperience WorkExperience);
    WorkExperience updateWorkExperience(WorkExperience WorkExperience);
    void deleteWorkExperience(Long id);
    WorkExperience getWorkExperience(Long id);
}
