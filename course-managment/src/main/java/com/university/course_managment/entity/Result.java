package com.university.course_managment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "results", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id", "year", "semester"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = {"student", "course"})
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
}