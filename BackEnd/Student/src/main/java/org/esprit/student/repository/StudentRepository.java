package org.esprit.student.repository;

import org.esprit.student.entity.Education;
import org.esprit.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student,String> {
=======
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student,String> {

        @Query("SELECT s.name FROM Skill s JOIN s.students st WHERE st.userId = :userId")
        List<String> findSkillNamesByStudentId(String userId);


>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
}
