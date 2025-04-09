package org.esprit.student.controller.dto;
public class CourseDto {
    private String title;
    private String url;

    public CourseDto(String title, String url) {
        this.title = title;
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }
}
