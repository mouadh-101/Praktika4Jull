package org.esprit.student.repository;

import org.esprit.student.entity.Skill;
import org.esprit.student.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience,Long> {
}
