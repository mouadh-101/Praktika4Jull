package org.esprit.student.service.Interface;

import org.esprit.student.entity.ExtraActivities;

public interface IExtraActivitiesService {
    ExtraActivities addExtraActivities(ExtraActivities extraActivities);
    ExtraActivities updateExtraActivities(ExtraActivities extraActivities);
    void deleteExtraActivities(Long id);
    ExtraActivities getExtraActivities(Long id);
}
