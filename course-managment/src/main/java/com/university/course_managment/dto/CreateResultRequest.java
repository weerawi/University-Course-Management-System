package com.university.course_managment.dto; 

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
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
}

