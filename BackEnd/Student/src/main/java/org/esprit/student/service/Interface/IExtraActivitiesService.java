package org.esprit.student.service.Interface;

import org.esprit.student.entity.ExtraActivities;

public interface IExtraActivitiesService {
<<<<<<< HEAD
    ExtraActivities addExtraActivities(ExtraActivities extraActivities);
=======
    ExtraActivities addExtraActivities(ExtraActivities extraActivities,String id);
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    ExtraActivities updateExtraActivities(Long id,ExtraActivities extraActivities);
    void deleteExtraActivities(Long id);
    ExtraActivities getExtraActivities(Long id);
}
