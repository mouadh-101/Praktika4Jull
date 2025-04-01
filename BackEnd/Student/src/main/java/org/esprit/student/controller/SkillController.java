package org.esprit.student.controller;

<<<<<<< HEAD
=======
import org.esprit.student.controller.dto.CourseDto;
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
import org.esprit.student.entity.Skill;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.ISkillService;
import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
=======
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b

@RestController
@RequestMapping("/api/Student/Skills")
public class SkillController{
    @Autowired
    ISkillService skillService;
    @Autowired
    StudentRepository studentRepository;
<<<<<<< HEAD
    @PostMapping
    public Skill addskill(@RequestBody Skill skill) {
        return skillService.addSkill(skill);
    }

    @PostMapping("/affect")
    public Skill addskillandAffect(@RequestBody Skill skill ,@RequestHeader("userId")String userId) {
        if(studentRepository.existsById(userId) && studentRepository.findById(userId)!=null) {
            skill.setStudents(new ArrayList<>());
            Student s =studentRepository.findById(userId).orElse(null);
            System.out.println(s.toString());
            skill.getStudents().add(s);
            s.getSkills().add(skill);
            return skillService.addSkill(skill);
        }
        System.out.println("user nf");
        return null;
=======

    @PostMapping
    public Skill addskill(@RequestBody Skill skill ,@RequestHeader("userId")String userId) {
        return skillService.addSkill(skill,userId);
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    }



    @PutMapping("/{id}")
    public Skill updateskill(@PathVariable("id") Long id,@RequestBody Skill skill) {
        return skillService.updateSkill(id,skill);
    }
<<<<<<< HEAD

=======
    @PutMapping("/affect/{id}")
    public Skill affecterSkill(@PathVariable("id") Long id,@RequestHeader("userId") String idS) {
        return skillService.affecterSkill(id,idS);
    }
    @PutMapping("/disAffect/{id}")
    public Skill desAffecterSkill(@PathVariable("id") Long id,@RequestHeader("userId") String idS) {
        return skillService.disAffecterSkill(id,idS);
    }
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
    @DeleteMapping("/{id}")
    public void deleteskill(@PathVariable("id")Long id) {
        skillService.deleteSkill(id);
    }

<<<<<<< HEAD
    @GetMapping
    public Skill getskill(@PathVariable("id")Long id) {
        return skillService.getSkill(id);
    }
=======
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
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b


}
