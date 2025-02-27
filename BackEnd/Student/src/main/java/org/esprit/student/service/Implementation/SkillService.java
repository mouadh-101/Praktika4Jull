package org.esprit.student.service.Implementation;


import lombok.extern.slf4j.Slf4j;
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

import java.util.ArrayList;
import java.util.List;


@Service
@Slf4j
public class SkillService implements ISkillService {
    @Autowired
    SkillRepository skillRepository;
    @Autowired
    StudentRepository studentRepository;


    @Override
    public Skill addSkill(Skill skill,String userId) {
        if(skillRepository.existsByName(skill.getName()))
        {
            Student s =studentRepository.findById(userId).orElse(null);
            Skill skillE=skillRepository.findByName(skill.getName());
            skillE.getStudents().add(s);
            s.getSkills().add(skillE);
            return skillRepository.save(skillE);
        }
        else {
            if (studentRepository.existsById(userId)) {
                skill.setStudents(new ArrayList<>());
                Student s = studentRepository.findById(userId).orElse(null);
                skill.getStudents().add(s);
                s.getSkills().add(skill);

                return skillRepository.save(skill);
            }
        }
        return null;
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

    @Override
    public Skill affecterSkill(Long id, String idS) {
        Skill s=skillRepository.findById(id).orElse(null);
        if(s!=null)
        {
            s.getStudents().add(studentRepository.findById(idS).orElse(null));
            studentRepository.findById(idS).orElse(null).getSkills().add(s);
            return skillRepository.save(s);
        }
        return null;
    }

    @Override
    public Skill disAffecterSkill(Long id, String idS) {
        Skill s=skillRepository.findById(id).orElse(null);
        if(s!=null)
        {
            s.getStudents().remove(studentRepository.findById(idS).orElse(null));
            studentRepository.findById(idS).orElse(null).getSkills().remove(s);
            System.out.println(s.toString());
            return skillRepository.save(s);
        }
        return null;
    }

    @Override
    public List<Skill> find10Skill(String id) {
        return skillRepository.findTop10UnassignedSkills(id);
    }
}
