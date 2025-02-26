package org.esprit.student.service.Implementation;


import org.esprit.student.entity.Student;
import org.esprit.student.entity.WorkExperience;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.repository.WorkExperienceRepository;
import org.esprit.student.service.Interface.IStudentService;
import org.esprit.student.service.Interface.IWorkExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
public class WorkExperienceService implements IWorkExperienceService {
    @Autowired
    WorkExperienceRepository workExperienceRepository;

    @Override
    public WorkExperience addWorkExperience(WorkExperience workExperience) {
        return workExperienceRepository.save(workExperience);
    }

    @Override
    public WorkExperience updateWorkExperience(Long id,WorkExperience workExperience) {
        WorkExperience existingWorkExperience = workExperienceRepository.findById(id).orElse(null);
        if(existingWorkExperience!=null)
        {
            existingWorkExperience.setPosition(workExperience.getPosition());
            existingWorkExperience.setAddress(workExperience.getAddress());
            existingWorkExperience.setStartDate(workExperience.getStartDate());
            existingWorkExperience.setEndDate(workExperience.getEndDate());
            existingWorkExperience.setDescription(workExperience.getDescription());

            return workExperienceRepository.save(existingWorkExperience);
        }
        return null;
    }

    @Override
    public void deleteWorkExperience(Long id) {

    }

    @Override
    public ResponseEntity<WorkExperience> getWorkExperience(Long id) {
        return null;
    }
}
