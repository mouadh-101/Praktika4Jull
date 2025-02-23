package org.esprit.student.controller;

import org.esprit.student.entity.Skill;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.ISkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/Student/Skills")
public class SkillController{
    @Autowired
    ISkillService skillService;
    @Autowired
    StudentRepository studentRepository;
    @PostMapping
    public Skill addskill(@RequestBody Skill skill) {
        return skillService.addSkill(skill);
    }

    @PostMapping("/{userId}")
    public Skill addskillandAffect(@RequestBody Skill skill ,@PathVariable("userId")String userId) {
        if(studentRepository.existsStudentByUserId(userId) && studentRepository.findStudentByUserId(userId)!=null) {
            skill.setStudents(new ArrayList<>());
            Student s =studentRepository.findStudentByUserId(userId);
            System.out.println(s.toString());
            skill.getStudents().add(s);
            s.getSkills().add(skill);
            return skillService.addSkill(skill);
        }
        System.out.println("user nf");
        return null;
    }



    @PutMapping("/{id}")
    public Skill updateskill(@PathVariable("id") Long id,@RequestBody Skill skill) {
        return skillService.updateSkill(id,skill);
    }

    @DeleteMapping("/{id}")
    public void deleteskill(@PathVariable("id")Long id) {
        skillService.deleteSkill(id);
    }

    @GetMapping
    public Skill getskill(@PathVariable("id")Long id) {
        return skillService.getSkill(id);
    }


}
