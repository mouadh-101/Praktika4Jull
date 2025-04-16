package org.esprit.student.controller;

import org.esprit.student.controller.dto.ASIDto;
import org.esprit.student.controller.dto.AnalyzeDto;
import org.esprit.student.controller.dto.ApplicationDto;
import org.esprit.student.entity.Application;
import org.esprit.student.entity.Education;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IApplicationService;
import org.esprit.student.service.Interface.IEducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Application> addApplication(@RequestBody Application application,
                                                      @RequestHeader("userId") String userId,
                                                      @PathVariable("id") int internshipId) {
        Application savedApplication = applicationService.addApplication(application, userId, internshipId);
        return ResponseEntity.ok(savedApplication);
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
    @GetMapping("/student")
    List<ASIDto> getStudentApplication(@RequestHeader("userId") String userId)
    {
        return applicationService.getAllStudentApplication(userId);
    }
    @GetMapping("/company")
    List<ASIDto> getCompanyApplication(@RequestHeader("userId") String userId)
    {
        return applicationService.getAllCompanyApplication(userId);
    }
    @GetMapping("/asi/{id}")
    public ASIDto getASI(@PathVariable Long id) {
        return applicationService.getASI(id);
    }
    @GetMapping("/analyze/{id}")
    public AnalyzeDto getAnalyze(@PathVariable Long id) {
        return applicationService.getAnalyze(id);
    }

}
