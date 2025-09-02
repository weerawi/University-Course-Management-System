package com.university.course_managment.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateResultRequest {
    @NotNull
    private Long studentId;
    
    @NotNull
    private Long courseId;
    
    @NotNull
    @Min(0)
    @Max(100)
    private Double midtermScore;
    
    @NotNull
    @Min(0)
    @Max(100)
    private Double finalScore;
    
    @NotNull
    @Min(1)
    @Max(4)
    private Integer year;
    
    @NotNull
    private String semester;

    // Constructors
    public CreateResultRequest() {}

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Double getMidtermScore() {
        return midtermScore;
    }

    public void setMidtermScore(Double midtermScore) {
        this.midtermScore = midtermScore;
    }

    public Double getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(Double finalScore) {
        this.finalScore = finalScore;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
}