package com.university.course_managment.dto; 

import java.util.Map;

import lombok.Data;

@Data
public class DashboardStats {
    private Long totalStudents;
    private Long totalCourses;
    private Long totalInstructors;
    private Long totalResults;
    private Integer enrolledCourses;
    private Integer completedCourses;
    private Double gpa;
    private Map<String, Object> additionalStats;
}
