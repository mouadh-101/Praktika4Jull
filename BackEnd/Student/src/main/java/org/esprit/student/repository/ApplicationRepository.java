package org.esprit.student.repository;

import org.esprit.student.controller.dto.ASIDto;
import org.esprit.student.controller.dto.ApplicationDto;
import org.esprit.student.entity.Application;
import org.esprit.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {
    ApplicationDto findAppById(Long id);
    List<ApplicationDto> findByStudent(Student student);
    ASIDto findASIByID(Long id);
}
