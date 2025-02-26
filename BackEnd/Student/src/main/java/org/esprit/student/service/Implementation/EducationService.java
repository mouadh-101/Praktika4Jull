package org.esprit.student.service.Implementation;


import org.esprit.student.entity.Education;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.EducationRepository;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IEducationService;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
public class EducationService implements IEducationService {
    @Autowired
    EducationRepository educationRepository;

    @Override
    public Education addEducation(Education education) {
        return educationRepository.save(education);
    }

    @Override
    public Education updateEducation(Long id,Education education) {
        Education extEdu= educationRepository.findById(id).orElse(null);
        if(extEdu!=null) {
            extEdu.setSchoolName(education.getSchoolName());
            extEdu.setDegree(education.getDegree());
            extEdu.setStartDate(education.getStartDate());
            extEdu.setEndDate(education.getEndDate());
            return educationRepository.save(extEdu);
        }
        return null;
    }

    @Override
    public void deleteEducation(Long id) {

        educationRepository.delete(educationRepository.findById(id).orElse(null));
    }

    @Override
    public Education getEducation(Long id) {
        return educationRepository.findById(id).orElse(null);
    }
}
