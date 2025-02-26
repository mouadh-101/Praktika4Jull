package org.esprit.student.service.Implementation;


import org.esprit.student.entity.Education;
import org.esprit.student.entity.ExtraActivities;
import org.esprit.student.repository.EducationRepository;
import org.esprit.student.repository.ExtraActivitiesRepository;
import org.esprit.student.service.Interface.IEducationService;
import org.esprit.student.service.Interface.IExtraActivitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ExtraActivitiesService implements IExtraActivitiesService {
    @Autowired
    ExtraActivitiesRepository extraActivitiesRepository;


    @Override
    public ExtraActivities addExtraActivities(ExtraActivities extraActivities) {
        return extraActivitiesRepository.save(extraActivities);
    }

    @Override
    public ExtraActivities updateExtraActivities(Long id,ExtraActivities extraActivities) {
        ExtraActivities existingActivity = extraActivitiesRepository.findById(id).orElse(null);
        if(existingActivity!=null) {
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
