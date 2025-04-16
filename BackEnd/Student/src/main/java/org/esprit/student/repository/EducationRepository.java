package org.esprit.student.repository;

import org.esprit.student.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education,Long> {
    @Query("SELECT e.degree, COUNT(s) FROM Student s JOIN s.educations e GROUP BY e.degree ORDER BY COUNT(s) DESC")
    List<Object[]> getMostCommonEducation();
}
