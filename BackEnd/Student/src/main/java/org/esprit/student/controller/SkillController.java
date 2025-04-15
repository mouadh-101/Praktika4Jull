package org.esprit.student.controller;

import org.esprit.student.controller.dto.CourseDto;
import org.esprit.student.controller.dto.SkillStudentCountDTO;
import org.esprit.student.entity.Skill;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.ISkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/Student/Skills")
public class SkillController{
    @Autowired
    ISkillService skillService;
    @Autowired
    StudentRepository studentRepository;

    @PostMapping
    public Skill addskill(@RequestBody Skill skill ,@RequestHeader("userId")String userId) {
        return skillService.addSkill(skill,userId);
    }



    @PutMapping("/{id}")
    public Skill updateskill(@PathVariable("id") Long id,@RequestBody Skill skill) {
        return skillService.updateSkill(id,skill);
    }
    @PutMapping("/affect/{id}")
    public Skill affecterSkill(@PathVariable("id") Long id,@RequestHeader("userId") String idS) {
        return skillService.affecterSkill(id,idS);
    }
    @PutMapping("/disAffect/{id}")
    public Skill desAffecterSkill(@PathVariable("id") Long id,@RequestHeader("userId") String idS) {
        return skillService.disAffecterSkill(id,idS);
    }
    @DeleteMapping("/{id}")
    public void deleteskill(@PathVariable("id")Long id) {
        skillService.deleteSkill(id);
    }

    @GetMapping("/{id}")
    public Skill getskill(@PathVariable("id")Long id) {
        return skillService.getSkill(id);
    }
    @GetMapping("/f10")
    public List<Skill> find10First(@RequestHeader("userId") String id)
    {
        return skillService.find10Skill(id);
    }
    @GetMapping("/enhancer")
    public ResponseEntity<List<CourseDto>> getCourses(@RequestHeader String userId) {
        return ResponseEntity.ok(skillService.searchUdemyCourses(userId));
    }
    @GetMapping("/student-count")
    public List<SkillStudentCountDTO> getStudentCountPerSkill() {
        return skillService.getStudentCountPerSkill();
    }


}
