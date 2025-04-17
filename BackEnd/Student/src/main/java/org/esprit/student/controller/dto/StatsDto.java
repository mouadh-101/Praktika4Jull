package org.esprit.student.controller.dto;

public class StatsDto {

    private long totalCount;
    private long pendingCount;
    private long acceptedCount;
    private long rejectedCount;

    public StatsDto(long totalCount, long pendingCount, long acceptedCount, long rejectedCount) {
        this.totalCount = totalCount;
        this.pendingCount = pendingCount;
        this.acceptedCount = acceptedCount;
        this.rejectedCount = rejectedCount;
    }

    // Getters and setters

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }
}

