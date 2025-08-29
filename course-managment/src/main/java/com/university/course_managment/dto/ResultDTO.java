package com.university.course_managment.dto; 

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private Double midtermScore;
    private Double finalScore;
    private Double totalScore;
    private String grade;
    private Integer year;
    private String semester;
}