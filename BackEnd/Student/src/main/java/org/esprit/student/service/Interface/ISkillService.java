package org.esprit.student.service.Interface;

import org.esprit.student.entity.Skill;

public interface ISkillService {
    Skill addSkill(Skill skill);
    Skill updateSkill(Long id,Skill skill);
    void deleteSkill(Long id);
    Skill getSkill(Long id);
}
