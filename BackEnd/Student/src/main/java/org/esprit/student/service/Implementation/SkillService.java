package org.esprit.student.service.Implementation;


import org.esprit.student.entity.Education;
import org.esprit.student.entity.ExtraActivities;
import org.esprit.student.entity.Skill;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.EducationRepository;
import org.esprit.student.repository.SkillRepository;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IEducationService;
import org.esprit.student.service.Interface.ISkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class SkillService implements ISkillService {
    @Autowired
    SkillRepository skillRepository;
    StudentRepository studentRepository;


    @Override
    public Skill addSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    @Override
    public Skill updateSkill(Long id,Skill skill) {
        Skill existingSkill = skillRepository.findById(id).orElse(null);
        if(existingSkill!=null) {
            existingSkill.setName(skill.getName());
            return skillRepository.save(existingSkill);
        }
        return null;
    }

    @Override
    public void deleteSkill(Long id) {
        skillRepository.delete(skillRepository.findById(id).orElse(null));
    }

    @Override
    public Skill getSkill(Long id) {
        return skillRepository.findById(id).orElse(null);
    }
}
