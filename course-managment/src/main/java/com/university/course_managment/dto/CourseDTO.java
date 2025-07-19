package com.university.course_managment.dto; 

import lombok.Data;

@Data
public class CourseDTO {
    private Long id;
    private String code;
    private String title;
    private String description;
    private Integer credits;
    private Integer capacity;
    private Integer enrolledStudents;
    private String instructorName;
    private Long instructorId;
}
