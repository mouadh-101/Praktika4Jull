package org.esprit.student.controller.dto;

import java.time.LocalDate;
import java.util.List;

public interface StudentDto {
    String getUserId();
    String getProfilePic();
    String getFieldOfStudy();
    LocalDate getDateOfBirth();
    String getBio();
    List<SkillDto> getSkills();
    List<EducationDto> getEducations();
    List<ExtraActivitiesDto> getExtraActivities();
    List<WorkExperienceDto> getWorkExperiences();

    interface SkillDto {
        Long getId();
        String getName();
    }

    interface EducationDto {
        Long getId();
        String getDegree();
        String getSchoolName();
        LocalDate getStartDate();
        LocalDate getEndDate();
    }

    interface ExtraActivitiesDto {
        Long getId();
        String getTitle();
        String getDescription();
    }

    interface WorkExperienceDto {
        Long getId();
        String getPosition();
        String getCompanyName();
        LocalDate getStartDate();
        LocalDate getEndDate();
        String getDescription();
    }
}
