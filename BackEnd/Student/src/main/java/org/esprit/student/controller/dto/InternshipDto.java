package org.esprit.student.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface InternshipDto {
    int getId();
    String getTitre();
    String getDescription();
    String getLocation();
    boolean isRemote();
    String getField();
    int getDuration();
    LocalDate getStartDate();
    LocalDate getEndDate();
    BigDecimal getCompensation();
    LocalDateTime getCreateAt();
    LocalDateTime getLastModifiedDate();
    LocalDate getApplicationDeadline();
    String getStatus();
    List<RequirementDto> getRequirements();
    CompanyDto getCompany();
    interface RequirementDto {
        int getId();
        String getDescription();
    }

    interface CompanyDto {
        String getIndustry();
        String getWebsite();
        String getDescription();
        String getLogo();
    }
}
