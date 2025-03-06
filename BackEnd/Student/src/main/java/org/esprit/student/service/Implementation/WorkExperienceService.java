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
    @Autowired
    StudentRepository studentRepository;

    @Override
    public WorkExperience addWorkExperience(WorkExperience workExperience,String id) {
        if (studentRepository.existsById(id) && studentRepository.findById(id) != null) {
            Student s = studentRepository.findById(id).orElse(null);
            workExperience.setStudent(s);
            return workExperienceRepository.save(workExperience);
        }
        System.out.println("user nf");
        return null;
    }

    @Override
    public WorkExperience updateWorkExperience(Long id,WorkExperience workExperience) {
        WorkExperience existingWorkExperience = workExperienceRepository.findById(id).orElse(null);
        System.out.println("workExppppp= "+existingWorkExperience);
        if(existingWorkExperience!=null)
        {
            existingWorkExperience.setPosition(workExperience.getPosition());
            existingWorkExperience.setCompanyName(workExperience.getCompanyName());
            existingWorkExperience.setAddress(workExperience.getAddress());
            existingWorkExperience.setStartDate(workExperience.getStartDate());
            existingWorkExperience.setEndDate(workExperience.getEndDate());
            existingWorkExperience.setDescription(workExperience.getDescription());
            System.out.println(existingWorkExperience);

            return workExperienceRepository.save(existingWorkExperience);
        }
        return null;
    }

    @Override
    public void deleteWorkExperience(Long id) {
        workExperienceRepository.delete(workExperienceRepository.findById(id).orElse(null));
    }

    @Override
    public ResponseEntity<WorkExperience> getWorkExperience(Long id) {
        return null;
    }
}
