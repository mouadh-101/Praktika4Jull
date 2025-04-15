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
    InternshipDto getInternship();

    interface StudentDto {
        String getUserId();
        String getProfilePic();
        String getFieldOfStudy();
        LocalDate getDateOfBirth();
        String getBio();
        List<SkillDto> getSkills();
        List<EducationDto> getEducations();
        List<ExtraActivitiesDto> getExtraActivities();
        List<WorkExperienceDto> getWorkExperiences();
    }

    interface SkillDto {
        Long getId();
        String getName();
    }

    interface EducationDto {
        Long getId();
        String getDegree();
        String getSchool();
        LocalDate getStartDate();
        LocalDate getEndDate();
    }

    interface ExtraActivitiesDto {
        Long getId();
        String getName();
        String getDescription();
    }

    interface WorkExperienceDto {
        Long getId();
        String getTitle();
        String getCompany();
        LocalDate getStartDate();
        LocalDate getEndDate();
        String getDescription();
    }




}
