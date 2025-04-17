package org.esprit.student.controller.dto;

import org.esprit.student.entity.ApplicationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ASIDto {
    Long getId();
    String getCoverLetter();
    LocalDate getAppliedAt();
    ApplicationStatus getStatus();

    StudentDto getStudent();
    UserData getUser();
    InternshipDto getInternship();







}
