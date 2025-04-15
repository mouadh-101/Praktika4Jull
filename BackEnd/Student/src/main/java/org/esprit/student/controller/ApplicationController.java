package org.esprit.student.controller;

import org.esprit.student.controller.dto.ApplicationDto;
import org.esprit.student.entity.Application;
import org.esprit.student.entity.Education;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IApplicationService;
import org.esprit.student.service.Interface.IEducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Student/App")
@PreAuthorize("isAuthenticated()")
public class ApplicationController {
    @Autowired
    IApplicationService applicationService;
    @PostMapping("/{id}")
    Application addApplication(@RequestBody Application application, @RequestHeader("userId") String userId , @PathVariable("id") int internshipId)
    {
        return applicationService.addApplication(application,userId,internshipId);
    }
    @PutMapping("/{id}")
    Application updateApplication(@PathVariable("id") Long id,@RequestBody Application application)
    {
        return applicationService.updateApplication(id,application);
    }
    @DeleteMapping("/{id}")
    void deleteApplication(@PathVariable("id") Long id)
    {
        applicationService.deleteApplication(id);
    }
    @GetMapping("/{id}")
    ApplicationDto getApplication(@PathVariable("id") Long id)
    {
        return applicationService.getApplication(id);
    }
    @GetMapping
    List<ApplicationDto> getStudentApplication(@RequestHeader("userId") String userId)
    {
        return applicationService.getStudentApplication(userId);
    }

}
