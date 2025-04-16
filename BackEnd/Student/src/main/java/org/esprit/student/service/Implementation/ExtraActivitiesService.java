package org.esprit.student.service.Implementation;


import org.esprit.student.entity.Education;
import org.esprit.student.entity.ExtraActivities;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.EducationRepository;
import org.esprit.student.repository.ExtraActivitiesRepository;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IEducationService;
import org.esprit.student.service.Interface.IExtraActivitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;


@Service
public class ExtraActivitiesService implements IExtraActivitiesService {
    @Autowired
    ExtraActivitiesRepository extraActivitiesRepository;
    @Autowired
    StudentRepository studentRepository;


    @Override
    public ExtraActivities addExtraActivities(ExtraActivities extraActivities ,String id) {
        if(studentRepository.existsById(id) && studentRepository.findById(id)!=null) {
            Student s =studentRepository.findById(id).orElse(null);
            extraActivities.setStudent(s);
            return extraActivitiesRepository.save(extraActivities);
        }
        System.out.println("user nf");
        return null;
    }

    @Override
    public ExtraActivities updateExtraActivities(Long id,ExtraActivities extraActivities) {
        ExtraActivities existingActivity = extraActivitiesRepository.findById(id).orElse(null);
        if(existingActivity!=null) {
            existingActivity.setTitle(extraActivities.getTitle());
            existingActivity.setDescription(extraActivities.getDescription());
            return extraActivitiesRepository.save(existingActivity);
        }
        return null;
    }

    @Override
    public void deleteExtraActivities(Long id) {
        extraActivitiesRepository.delete(extraActivitiesRepository.findById(id).orElse(null));
    }

    @Override
    public ExtraActivities getExtraActivities(Long id) {
        return extraActivitiesRepository.findById(id).orElse(null);
    }
}