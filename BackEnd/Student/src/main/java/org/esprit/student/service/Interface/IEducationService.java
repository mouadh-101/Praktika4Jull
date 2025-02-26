package org.esprit.student.service.Interface;

import org.esprit.student.entity.Education;

public interface IEducationService {
    Education addEducation(Education education);
    Education updateEducation(Long id,Education education);
    void deleteEducation(Long id);
    Education getEducation(Long id);
}
