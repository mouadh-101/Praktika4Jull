package org.esprit.student.controller;

import org.esprit.student.entity.WorkExperience;
import org.esprit.student.service.Interface.IWorkExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/Student/WorkExp")
public class WorkExpController {
    @Autowired
    IWorkExperienceService workExperienceService;
    @PostMapping
    public WorkExperience addworkExperience(@RequestBody WorkExperience workExperience,@RequestHeader("userId") String id)
    {
        return workExperienceService.addWorkExperience(workExperience,id);
    }
    @GetMapping("/{id}")
    public ResponseEntity<WorkExperience> getworkExperience(@PathVariable("id") Long id)
    {
        return workExperienceService.getWorkExperience(id);
    }
    @DeleteMapping("/{id}")
    public void deleteworkExperience(@PathVariable("id")Long id) {
        workExperienceService.deleteWorkExperience(id);
    }
    @PutMapping("/{id}")
    public WorkExperience updateworkExperience(@RequestBody WorkExperience workExperience ,@PathVariable("id") Long id) {
        return workExperienceService.updateWorkExperience(id,workExperience);
    }



}
