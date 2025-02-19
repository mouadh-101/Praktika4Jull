package org.esprit.student.repository;

import org.esprit.student.entity.Education;
import org.esprit.student.entity.ExtraActivities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExtraActivitiesRepository extends JpaRepository<ExtraActivities,Long> {
}
