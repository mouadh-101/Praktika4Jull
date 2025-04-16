package org.esprit.student.controller.dto;

import org.esprit.student.entity.ApplicationStatus;

import java.time.LocalDate;
import java.util.List;

public interface ApplicationDto {
    Long getId();
    String getCoverLetter();
    LocalDate getAppliedAt();
    ApplicationStatus getStatus();

    StudentDto getStudent();
    int getInternshipId();







}
