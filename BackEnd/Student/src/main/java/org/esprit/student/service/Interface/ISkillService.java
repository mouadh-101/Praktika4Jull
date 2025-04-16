package org.esprit.student.service.Interface;

import org.esprit.student.controller.dto.CourseDto;
import org.esprit.student.controller.dto.SkillStudentCountDTO;
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
    List<SkillStudentCountDTO> getStudentCountPerSkill();
}