package org.esprit.student.service.Interface;

import org.esprit.student.entity.Education;
<<<<<<< HEAD

public interface IEducationService {
    Education addEducation(Education education);
    Education updateEducation(Long id,Education education);
    void deleteEducation(Long id);
    Education getEducation(Long id);
=======
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

public interface IEducationService {
    Education addEducation(Education education,String id);
    Education updateEducation(Long id,Education education);
    void deleteEducation(Long id);
    Education getEducation(Long id);

>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
}
