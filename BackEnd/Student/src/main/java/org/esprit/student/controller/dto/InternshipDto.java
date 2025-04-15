package org.esprit.student.controller.dto;

import java.time.LocalDate;

public class InternshipDto {
    int id;
    String titre ;
    String description;
    String location;
    boolean remote;
    String field;
    int duration;
    LocalDate startDate;
    LocalDate endDate;
}
