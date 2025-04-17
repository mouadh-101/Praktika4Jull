package org.esprit.student.controller.dto;

public class ApplicationStatisticsDto {
    private Long total;
    private Long pending;
    private Long accepted;
    private Long rejected;

    // Constructor
    public ApplicationStatisticsDto(Long total, Long pending, Long accepted, Long rejected) {
        this.total = total;
        this.pending = pending;
        this.accepted = accepted;
        this.rejected = rejected;
    }

    // Getters and Setters
    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Long getPending() {
        return pending;
    }

    public void setPending(Long pending) {
        this.pending = pending;
    }

    public Long getAccepted() {
        return accepted;
    }

    public void setAccepted(Long accepted) {
        this.accepted = accepted;
    }

    public Long getRejected() {
        return rejected;
    }

    public void setRejected(Long rejected) {
        this.rejected = rejected;
    }
}

