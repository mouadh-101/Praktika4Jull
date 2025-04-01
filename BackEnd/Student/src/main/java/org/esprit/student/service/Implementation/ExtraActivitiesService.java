package org.esprit.student.service.Implementation;


import org.esprit.student.entity.Education;
import org.esprit.student.entity.ExtraActivities;
<<<<<<< HEAD
import org.esprit.student.repository.EducationRepository;
import org.esprit.student.repository.ExtraActivitiesRepository;
=======
import org.esprit.student.entity.Student;
import org.esprit.student.repository.EducationRepository;
import org.esprit.student.repository.ExtraActivitiesRepository;
import org.esprit.student.repository.StudentRepository;
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
import org.esprit.student.service.Interface.IEducationService;
import org.esprit.student.service.Interface.IExtraActivitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
=======
import java.util.ArrayList;

>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b

@Service
public class ExtraActivitiesService implements IExtraActivitiesService {
    @Autowired
    ExtraActivitiesRepository extraActivitiesRepository;
<<<<<<< HEAD


    @Override
    public ExtraActivities addExtraActivities(ExtraActivities extraActivities) {
        return extraActivitiesRepository.save(extraActivities);
=======
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
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    }

    @Override
    public ExtraActivities updateExtraActivities(Long id,ExtraActivities extraActivities) {
        ExtraActivities existingActivity = extraActivitiesRepository.findById(id).orElse(null);
        if(existingActivity!=null) {
<<<<<<< HEAD
=======
            existingActivity.setTitle(extraActivities.getTitle());
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
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
