package org.esprit.student.service.Interface;

import org.esprit.student.entity.Education;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

public interface IEducationService {
    Education addEducation(Education education,String id);
    Education updateEducation(Long id,Education education);
    void deleteEducation(Long id);
    Education getEducation(Long id);

}
