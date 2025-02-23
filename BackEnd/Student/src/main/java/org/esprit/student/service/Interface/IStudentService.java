package org.esprit.student.service.Interface;

import org.esprit.student.entity.Student;
import org.esprit.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

public interface IStudentService {
    Student addStudent(Student student);
    Student updateStudent(Long id, Student student);
    void deleteStudent(Long id);
    ResponseEntity<Student> getStudent(String id);
}
