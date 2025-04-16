package org.esprit.student.controller.dto;

import org.esprit.student.entity.Application;
import org.esprit.student.entity.ApplicationStatus;

import java.time.LocalDate;

public class ASIDtoImpl implements ASIDto {

    private final Application application;
    private final InternshipDto internship;

    public ASIDtoImpl(Application application, InternshipDto internship) {
        this.application = application;
        this.internship = internship;
    }


    @Override
    public Long getId() {
        return application.getId();
    }

    @Override
    public String getCoverLetter() {
        return application.getCoverLetter();
    }

    @Override
    public LocalDate getAppliedAt() {
        return application.getAppliedAt();
    }

    @Override
    public ApplicationStatus getStatus() {
        return application.getStatus();
    }

    @Override
    public StudentDto getStudent() {
        return new StudentDtoImpl(application.getStudent());
    }

    @Override
    public InternshipDto getInternship() {
        return internship;
    }
}

