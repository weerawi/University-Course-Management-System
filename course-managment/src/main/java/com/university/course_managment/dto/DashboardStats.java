package com.university.course_managment.dto;

import java.util.Map;

public class DashboardStats {
    private Long totalStudents;
    private Long totalCourses;
    private Long totalInstructors;
    private Long totalResults;
    private Integer enrolledCourses;
    private Integer completedCourses;
    private Double gpa;
    private Map<String, Object> additionalStats;

    // Constructors
    public DashboardStats() {}

    // Getters and Setters
    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(Long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public Long getTotalInstructors() {
        return totalInstructors;
    }

    public void setTotalInstructors(Long totalInstructors) {
        this.totalInstructors = totalInstructors;
    }

    public Long getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(Long totalResults) {
        this.totalResults = totalResults;
    }

    public Integer getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(Integer enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public Integer getCompletedCourses() {
        return completedCourses;
    }

    public void setCompletedCourses(Integer completedCourses) {
        this.completedCourses = completedCourses;
    }

    public Double getGpa() {
        return gpa;
    }

    public void setGpa(Double gpa) {
        this.gpa = gpa;
    }

    public Map<String, Object> getAdditionalStats() {
        return additionalStats;
    }

    public void setAdditionalStats(Map<String, Object> additionalStats) {
        this.additionalStats = additionalStats;
    }
}