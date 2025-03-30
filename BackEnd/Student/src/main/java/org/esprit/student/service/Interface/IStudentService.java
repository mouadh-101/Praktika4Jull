package org.esprit.student.service.Interface;

<<<<<<< HEAD
=======
import jakarta.servlet.http.HttpServletResponse;
import org.esprit.student.controller.dto.UserDto;
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
import org.esprit.student.entity.Student;
import org.esprit.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
import java.util.Map;

public interface IStudentService {
    Student addStudent(Student student);
    Student updateStudent(String id, Student student);
    void deleteStudent(String id);
    ResponseEntity<Student> getStudent(String id);
<<<<<<< HEAD
=======
    List<String> getAllSkillsNames(String userId);
    void exportPdf(HttpServletResponse response, UserDto user, String userId,String template);
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
}
