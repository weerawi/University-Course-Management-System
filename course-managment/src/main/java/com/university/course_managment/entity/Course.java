package com.university.course_managment.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, exclude = {"students", "results"})
@ToString(exclude = {"students", "results", "instructor"})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Course extends BaseEntity {
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Integer credits;
    
    private Integer capacity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    @JsonIgnoreProperties({"courses", "password", "hibernateLazyInitializer"})
    private User instructor;
    
    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Student> students = new HashSet<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Result> results = new HashSet<>();
}