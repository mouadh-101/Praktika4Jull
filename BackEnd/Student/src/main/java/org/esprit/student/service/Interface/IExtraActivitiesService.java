package org.esprit.student.service.Interface;

import org.esprit.student.entity.ExtraActivities;

public interface IExtraActivitiesService {
    ExtraActivities addExtraActivities(ExtraActivities extraActivities,String id);
    ExtraActivities updateExtraActivities(Long id,ExtraActivities extraActivities);
    void deleteExtraActivities(Long id);
    ExtraActivities getExtraActivities(Long id);
}
