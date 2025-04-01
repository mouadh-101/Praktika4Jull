package org.esprit.student.controller;

import org.esprit.student.entity.Education;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IEducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/Student/Edu")
<<<<<<< HEAD
=======
@PreAuthorize("isAuthenticated()")
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
public class EducationController {
    @Autowired
    IEducationService educationService;
    @Autowired
    StudentRepository studentRepository;
    @PostMapping
<<<<<<< HEAD
    public Education addeducation(@RequestBody Education education) {
        return educationService.addEducation(education);
    }
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/affect")
    public Education addeducation(@RequestBody Education education, @RequestHeader("userId") String id) {
        Student s=studentRepository.findById(id).orElse(null);
        education.setStudent(s);
        return educationService.addEducation(education);
    }

=======
    public Education addeducation(@RequestBody Education education, @RequestHeader("userId") String id) {
        return educationService.addEducation(education,id);
    }
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    @PutMapping("/{id}")
    public Education updateeducation(@PathVariable("id") Long id,@RequestBody Education education) {
        return educationService.updateEducation(id,education);
    }

    @DeleteMapping("/{id}")
    public void deleteeducation(@PathVariable("id")Long id) {
        educationService.deleteEducation(id);
    }

<<<<<<< HEAD
    @GetMapping
=======
    @GetMapping("/{id}")
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    public Education geteducation(@PathVariable("id")Long id) {
        return educationService.getEducation(id);
    }


}
