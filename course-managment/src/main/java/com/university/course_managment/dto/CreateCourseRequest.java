package com.university.course_managment.dto; 

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateCourseRequest {
    @NotBlank
    private String code;
    
    @NotBlank
    private String title;
    
    private String description;
    
    @NotNull
    @Positive
    private Integer credits;
    
    @NotNull
    @Positive
    private Integer capacity;
    
    private Long instructorId;
}