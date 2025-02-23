package org.esprit.student.controller;

import org.esprit.student.entity.Student;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable("id") String id)
    {
        return studentService.getStudent(id);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteStudent(@PathVariable("id")Long id) {
        studentService.deleteStudent(id);
    }
    @PutMapping("/update/{id}")
    public Student updateStudent(@RequestBody Student student ,@PathVariable("id") Long id) {
        return studentService.updateStudent(id,student);
    }



}
