package org.esprit.student.repository;

import org.esprit.student.entity.Education;
import org.esprit.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student,String> {

        @Query("SELECT s.name FROM Skill s JOIN s.students st WHERE st.userId = :userId")
        List<String> findSkillNamesByStudentId(String userId);
        @Query("SELECT s.fieldOfStudy, COUNT(w) FROM Student s JOIN s.workExperiences w GROUP BY s.fieldOfStudy ORDER BY COUNT(w) DESC")
        List<Object[]> getTopFieldsWithInternships();


}