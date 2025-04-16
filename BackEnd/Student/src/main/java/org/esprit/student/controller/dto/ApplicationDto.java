package org.esprit.student.controller.dto;

import org.esprit.student.entity.ApplicationStatus;

import java.time.LocalDate;

public interface ApplicationDto {
    Long getId();
    String getCoverLetter();
    LocalDate getAppliedAt();
    ApplicationStatus getStatus();

    interface StudentProjection {
        String getUserId();
    }
    StudentProjection getStudent();
    int getInternshipId();
}