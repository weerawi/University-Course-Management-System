package com.university.course_managment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private Long id;
    private String studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private Integer year;
    private Integer enrolledCourses;
    // private Long userId; 
}
