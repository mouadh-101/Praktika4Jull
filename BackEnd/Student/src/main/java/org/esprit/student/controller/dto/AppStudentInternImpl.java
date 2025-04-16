package org.esprit.student.controller.dto;

import org.esprit.student.entity.ApplicationStatus;

import java.time.LocalDate;

public class AppStudentInternImpl implements ASIDto {

    private final ApplicationDto application;
    private final InternshipDto internship;

    public AppStudentInternImpl(ApplicationDto application, InternshipDto internship) {
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
        return application.getStudent(); // ✅ FIXED: Return directly without casting
    }

    @Override
    public InternshipDto getInternship() {
        return internship;
    }
}
