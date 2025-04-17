package org.esprit.student.controller.dto;

import org.aspectj.weaver.Lint;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

public class AnalyzeDto {

    private String adviceToImproveChances;
    private String coverLetterFeedback;
    private String hiringProbability;
    private List<String> profileStrengthScore;
    private String studentRating;

    // Getters and Setters

    public String getAdviceToImproveChances() {
        return adviceToImproveChances;
    }

    public void setAdviceToImproveChances(String adviceToImproveChances) {
        this.adviceToImproveChances = adviceToImproveChances;
    }

    public String getCoverLetterFeedback() {
        return coverLetterFeedback;
    }

    public void setCoverLetterFeedback(String coverLetterFeedback) {
        this.coverLetterFeedback = coverLetterFeedback;
    }

    public String getHiringProbability() {
        return hiringProbability;
    }

    public void setHiringProbability(String hiringProbability) {
        this.hiringProbability = hiringProbability;
    }

    public List<String> getProfileStrengthScore() {
        return profileStrengthScore;
    }

    public void setProfileStrengthScore(List<String> profileStrengthScore) {
        this.profileStrengthScore = profileStrengthScore;
    }

    public String getStudentRating() {
        return studentRating;
    }

    public void setStudentRating(String studentRating) {
        this.studentRating = studentRating;
    }

    @Override
    public String toString() {
        return "AnalyzeDto{" +
                "adviceToImproveChances='" + adviceToImproveChances + '\'' +
                ", coverLetterFeedback='" + coverLetterFeedback + '\'' +
                ", hiringProbability='" + hiringProbability + '\'' +
                ", profileStrengthScore=" + profileStrengthScore +
                ", studentRating='" + studentRating + '\'' +
                '}';
    }
}