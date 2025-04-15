package org.esprit.student.repository;

import org.esprit.student.controller.dto.SkillStudentCountDTO;
import org.esprit.student.entity.Education;
import org.esprit.student.entity.Skill;
import org.esprit.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill,Long> {

    boolean existsByName(String name);
    Skill findByName(String name);
    @Query("SELECT s FROM Skill s WHERE s.id NOT IN (SELECT us.id FROM Student s JOIN s.skills us WHERE s.userId = :userId) ORDER BY s.id DESC")
    List<Skill> findTop10UnassignedSkills(@Param("userId") String userId);
    @Query("SELECT s FROM Skill s WHERE s.id IN (SELECT us.id FROM Student st JOIN st.skills us WHERE st.userId = :userId)")
    List<Skill> findSkillsByUserId(@Param("userId") String userId);
    @Query("SELECT s.name AS skillName, COUNT(su.userId) AS studentCount " +
            "FROM Skill s LEFT JOIN s.students su " +
            "GROUP BY s.id")
    List<SkillStudentCountDTO> countStudentsPerSkill();

}
