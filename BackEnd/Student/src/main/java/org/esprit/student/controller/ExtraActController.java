package org.esprit.student.controller;

import org.esprit.student.entity.ExtraActivities;
import org.esprit.student.entity.Student;
import org.esprit.student.service.Interface.IExtraActivitiesService;
import org.esprit.student.service.Interface.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/Student/ExtraAct")
public class ExtraActController {
    @Autowired
    IExtraActivitiesService extraActivitiesService;
    @PostMapping
<<<<<<< HEAD
    public ExtraActivities addExtraActivities(@RequestBody ExtraActivities extraActivities) {
        return extraActivitiesService.addExtraActivities(extraActivities);
=======
    public ExtraActivities addExtraActivities(@RequestBody ExtraActivities extraActivities,@RequestHeader("userId") String userId) {
        return extraActivitiesService.addExtraActivities(extraActivities,userId);
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    }

    @PutMapping("/{id}")
    public ExtraActivities updateExtraActivities(@PathVariable("id") Long id,@RequestBody ExtraActivities extraActivities) {
        return extraActivitiesService.updateExtraActivities(id,extraActivities);
    }

    @DeleteMapping("/{id}")
    public void deleteExtraActivities(@PathVariable("id")Long id) {
        extraActivitiesService.deleteExtraActivities(id);
    }

<<<<<<< HEAD
    @GetMapping
=======
    @GetMapping("/{id}")
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    public ExtraActivities getExtraActivities(@PathVariable("id")Long id) {
        return extraActivitiesService.getExtraActivities(id);
    }



}
