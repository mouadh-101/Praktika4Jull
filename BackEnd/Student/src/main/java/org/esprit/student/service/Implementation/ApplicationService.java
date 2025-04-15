package org.esprit.student.service.Implementation;


import lombok.extern.slf4j.Slf4j;
import org.esprit.student.controller.dto.ASIDto;
import org.esprit.student.controller.dto.ApplicationDto;
import org.esprit.student.controller.dto.CourseDto;
import org.esprit.student.controller.dto.SkillStudentCountDTO;
import org.esprit.student.entity.Application;
import org.esprit.student.entity.Skill;
import org.esprit.student.entity.Student;
import org.esprit.student.repository.ApplicationRepository;
import org.esprit.student.repository.SkillRepository;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IApplicationService;
import org.esprit.student.service.Interface.ISkillService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


@Service
@Slf4j
public class ApplicationService implements IApplicationService {
    @Autowired
    ApplicationRepository  applicationRepository;
    @Autowired
    StudentRepository studentRepository;

    @Override
    public Application addApplication(Application application, String userId, int internshipId) {
        application.setStudent(studentRepository.findById(userId).orElse(null));
        application.setAppliedAt(LocalDate.now());
        application.setInternshipId(internshipId);
        return applicationRepository.save(application) ;
    }

    @Override
    public Application updateApplication(Long id, Application application) {
        Application exApp=applicationRepository.findById(id).orElse(null);
        if(exApp!=null)
        {
            exApp.setStatus(application.getStatus());
            exApp.setCoverLetter(application.getCoverLetter());
            return applicationRepository.save(exApp);
        }
        return null;
    }

    @Override
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }

    @Override
    public ApplicationDto getApplication(Long id) {
        return applicationRepository.findAppById(id);
    }

    @Override
    public List<ApplicationDto> getStudentApplication(String userId) {
        if (studentRepository.findById(userId).orElse(null)!=null)
        {
            return applicationRepository.findByStudent(studentRepository.findById(userId).orElse(null));
        }
        return null;
    }

    @Override
    public ASIDto getASI(Long id) {
        return applicationRepository.findASIByID(id);
    }
}
