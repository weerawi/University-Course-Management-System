package com.university.course_managment.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "results", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id", "year", "semester"}))
public class Result extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    private Double midtermScore;
    
    private Double finalScore;
    
    private Double totalScore;
    
    private String grade;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(nullable = false)
    private String semester;

    // Constructors
    public Result() {}

    public Result(Student student, Course course, Double midtermScore, Double finalScore, Integer year, String semester) {
        this.student = student;
        this.course = course;
        this.midtermScore = midtermScore;
        this.finalScore = finalScore;
        this.year = year;
        this.semester = semester;
    }

    // Builder pattern
    public static ResultBuilder builder() {
        return new ResultBuilder();
    }

    public static class ResultBuilder {
        private Student student;
        private Course course;
        private Double midtermScore;
        private Double finalScore;
        private Double totalScore;
        private String grade;
        private Integer year;
        private String semester;

        public ResultBuilder student(Student student) {
            this.student = student;
            return this;
        }

        public ResultBuilder course(Course course) {
            this.course = course;
            return this;
        }

        public ResultBuilder midtermScore(Double midtermScore) {
            this.midtermScore = midtermScore;
            return this;
        }

        public ResultBuilder finalScore(Double finalScore) {
            this.finalScore = finalScore;
            return this;
        }

        public ResultBuilder totalScore(Double totalScore) {
            this.totalScore = totalScore;
            return this;
        }

        public ResultBuilder grade(String grade) {
            this.grade = grade;
            return this;
        }

        public ResultBuilder year(Integer year) {
            this.year = year;
            return this;
        }

        public ResultBuilder semester(String semester) {
            this.semester = semester;
            return this;
        }

        public Result build() {
            Result result = new Result(student, course, midtermScore, finalScore, year, semester);
            result.setTotalScore(totalScore);
            result.setGrade(grade);
            return result;
        }
    }

    // Getters and Setters
    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
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

    public Double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Double totalScore) {
        this.totalScore = totalScore;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
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

    @Override
    public String toString() {
        return "Result{" +
                "midtermScore=" + midtermScore +
                ", finalScore=" + finalScore +
                ", totalScore=" + totalScore +
                ", grade='" + grade + '\'' +
                ", year=" + year +
                ", semester='" + semester + '\'' +
                '}';
    }
}