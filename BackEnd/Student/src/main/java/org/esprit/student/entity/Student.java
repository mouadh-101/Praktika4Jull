package org.esprit.student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor

public class Student {
    @Id
    String userId;
    String profilePic;
    String fieldOfStudy;
    LocalDate dateOfBirth;
    String Bio;
    @ManyToMany
    List<Skill> skills;
    @OneToMany(mappedBy = "student",cascade = CascadeType.ALL)
    List<ExtraActivities>extraActivities ;
    @OneToMany(mappedBy = "student",cascade = CascadeType.ALL)
    List<Education> educations;
    @OneToMany(mappedBy = "student",cascade = CascadeType.ALL)
    List<WorkExperience> workExperiences;
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications = new ArrayList<>();

    public String getUserId() {
        return userId;
    }

    public void setId(String id) {
        this.userId = id;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getBio() {
        return Bio;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public List<ExtraActivities> getExtraActivities() {
        return extraActivities;
    }

    public List<Education> getEducations() {
        return educations;
    }

    public List<WorkExperience> getWorkExperiences() {
        return workExperiences;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setBio(String bio) {
        Bio = bio;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    public void setExtraActivities(List<ExtraActivities> extraActivities) {
        this.extraActivities = extraActivities;
    }

    public void setEducations(List<Education> educations) {
        this.educations = educations;
    }

    public void setWorkExperiences(List<WorkExperience> workExperiences) {
        this.workExperiences = workExperiences;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }
}