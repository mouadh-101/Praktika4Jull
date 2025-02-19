package org.esprit.student.service.Interface;

import org.esprit.student.entity.Student;
import org.esprit.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;

public interface IStudentService {
    Student addStudent(Student student);
    Student updateStudent(Long id, Student student);
    void deleteStudent(Long id);
    Student getStudent(Long id);
}
