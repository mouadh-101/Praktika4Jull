package org.esprit.student.controller;

import org.esprit.student.entity.WorkExperience;
import org.esprit.student.service.Interface.IWorkExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
<<<<<<< HEAD
@RequestMapping("/api/workExperience/WorkExp")
public class WorkExpController {
    @Autowired
    IWorkExperienceService workExperienceService;
    @PostMapping("/add")
    public WorkExperience addworkExperience(@RequestBody WorkExperience workExperience)
    {
        return workExperienceService.addWorkExperience(workExperience);
=======
@RequestMapping("/api/Student/WorkExp")
public class WorkExpController {
    @Autowired
    IWorkExperienceService workExperienceService;
    @PostMapping
    public WorkExperience addworkExperience(@RequestBody WorkExperience workExperience,@RequestHeader("userId") String id)
    {
        return workExperienceService.addWorkExperience(workExperience,id);
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    }
    @GetMapping("/{id}")
    public ResponseEntity<WorkExperience> getworkExperience(@PathVariable("id") Long id)
    {
        return workExperienceService.getWorkExperience(id);
    }
<<<<<<< HEAD
    @DeleteMapping("/delete/{id}")
    public void deleteworkExperience(@PathVariable("id")Long id) {
        workExperienceService.deleteWorkExperience(id);
    }
    @PutMapping("/update/{id}")
=======
    @DeleteMapping("/{id}")
    public void deleteworkExperience(@PathVariable("id")Long id) {
        workExperienceService.deleteWorkExperience(id);
    }
    @PutMapping("/{id}")
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    public WorkExperience updateworkExperience(@RequestBody WorkExperience workExperience ,@PathVariable("id") Long id) {
        return workExperienceService.updateWorkExperience(id,workExperience);
    }



}
