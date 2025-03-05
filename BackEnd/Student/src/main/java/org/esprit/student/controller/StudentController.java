package org.esprit.student.controller;

import jakarta.ws.rs.Path;
import org.esprit.student.entity.Student;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/Student")
public class StudentController {
    @Autowired
    IStudentService studentService;
    @PostMapping("/add")
    public Student addStudent(@RequestBody Student student)
    {
        return studentService.addStudent(student);
    }
    @GetMapping
    public ResponseEntity<Student> getStudent(@RequestHeader("userId") String id)
    {
        return studentService.getStudent(id);
    }
    @DeleteMapping("/delete")
    public void deleteStudent(@RequestHeader("userId")String id) {
        studentService.deleteStudent(id);
    }
    @PutMapping("/update")
    public Student updateStudent(@RequestBody Student student ,@RequestHeader("userId") String id) {
        return studentService.updateStudent(id,student);
    }
    @GetMapping("/AllSkillsNames/{userId}")
    List<String> getAllSkillsNames(@PathVariable("userId") String userId){
        return studentService.getAllSkillsNames(userId);
    }



}
