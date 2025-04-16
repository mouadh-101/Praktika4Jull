package org.esprit.student.service.Implementation;


import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.esprit.student.client.AnalyzerClient;
import org.esprit.student.client.InternshipClient;
import org.esprit.student.controller.dto.*;
import org.esprit.student.entity.Application;
import org.esprit.student.repository.ApplicationRepository;
import org.esprit.student.repository.StudentRepository;
import org.esprit.student.service.Interface.IApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
public class ApplicationService implements IApplicationService {
    @Autowired
    ApplicationRepository  applicationRepository;
    @Autowired
    StudentRepository studentRepository;
    @Autowired
    private InternshipClient internshipClient;
    @Autowired
    private AnalyzerClient analyzerClient;

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
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + id));

        InternshipDto internship = internshipClient.getInternshipById(application.getInternshipId());
        if (internship == null) {
            throw new EntityNotFoundException("Internship not found with id: " + application.getInternshipId());
        }

        return new ASIDtoImpl(application, internship);
    }

    public List<ASIDto> getAllStudentApplication(String userId) {

        List<ApplicationDto> applications = applicationRepository.findByStudent(studentRepository.findById(userId).orElse(null));

        return applications.stream()
                .map(app -> {
                    InternshipDto internship = internshipClient.getInternshipById(app.getInternshipId());
                    return new AppStudentInternImpl(app, internship);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ASIDto> getAllCompanyApplication(String userId) {
        List<InternshipDto> internships = internshipClient.getInternshipsByCompanyId(userId);
        List<Long> internshipIds = internships.stream()
                .map(InternshipDto::getId)
                .collect(Collectors.toList());

        List<ApplicationDto> applications = applicationRepository.findByInternshipIdIn(internshipIds);

        return applications.stream()
                .map(app -> {
                    InternshipDto internship = internships.stream()
                            .filter(i -> i.getId().equals(app.getInternshipId()))
                            .findFirst()
                            .orElse(null); // Can be improved
                    return new AppStudentInternImpl(app, internship);
                })
                .collect(Collectors.toList());
    }


    @Override
    public AnalyzeDto getAnalyze(Long id) {
        ASIDto applicationDto=getASI(id);
        AnalyzeDto analyzeDto=analyzerClient.analyzeApplication(applicationDto);
        return analyzeDto;
    }


}
