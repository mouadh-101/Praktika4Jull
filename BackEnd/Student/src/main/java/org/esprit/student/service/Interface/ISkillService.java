package org.esprit.student.service.Interface;

<<<<<<< HEAD
import org.esprit.student.entity.Skill;

public interface ISkillService {
    Skill addSkill(Skill skill);
    Skill updateSkill(Long id,Skill skill);
    void deleteSkill(Long id);
    Skill getSkill(Long id);
=======
import org.esprit.student.controller.dto.CourseDto;
import org.esprit.student.entity.Education;
import org.esprit.student.entity.Skill;

import java.util.List;

public interface ISkillService {
    Skill addSkill(Skill skill,String userId);
    Skill updateSkill(Long id,Skill skill);
    void deleteSkill(Long id);
    Skill getSkill(Long id);
    Skill affecterSkill(Long id, String idS);
    Skill disAffecterSkill(Long id, String idS);
    List<Skill> find10Skill(String id);
    List<CourseDto> searchUdemyCourses(String userId);
>>>>>>> 364d59e95ab09b5de510e2f347ee51853e0eb61b
}
