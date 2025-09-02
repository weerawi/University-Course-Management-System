package com.university.course_managment.controller;

import com.university.course_managment.dto.CourseDTO;
import com.university.course_managment.dto.CreateCourseRequest;
import com.university.course_managment.dto.StudentDTO;
import com.university.course_managment.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {
    
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDTO> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(courseService.createCourse(request));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CreateCourseRequest request
    ) {
        return ResponseEntity.ok(courseService.updateCourse(id, request));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/students")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<List<StudentDTO>> getCourseStudents(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseStudents(id));
    }
}