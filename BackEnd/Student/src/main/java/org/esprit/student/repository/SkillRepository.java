package org.esprit.student.repository;

import org.esprit.student.entity.Education;
import org.esprit.student.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill,Long> {
}
