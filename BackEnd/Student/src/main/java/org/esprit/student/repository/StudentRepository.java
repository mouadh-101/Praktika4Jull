package org.esprit.student.repository;

import org.esprit.student.entity.Education;
import org.esprit.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long> {
    boolean existsStudentByUserId(String userId);
    Student findStudentByUserId(String userId);
}
