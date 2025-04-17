package org.esprit.student.controller.dto;

import org.esprit.student.entity.Application;
import org.esprit.student.entity.ApplicationStatus;

import java.time.LocalDate;

public class ASIDtoImpl implements ASIDto {

    private final Application application;
    private final InternshipDto internship;
    private final UserData user;

    public ASIDtoImpl(Application application, InternshipDto internship,UserData user) {
        this.application = application;
        this.internship = internship;
        this.user=user;
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
    public UserData getUser() {
        return user;
    }

    @Override
    public InternshipDto getInternship() {
        return internship;
    }
}

